// End-to-end walk through every endpoint against the real database.
//
// Creates two throwaway accounts, exercises the API with them — including the
// privacy rules that keep one user's data invisible to another — then deletes
// them again. Seeded content and the demo account are left untouched.
//
// Run: npm run smoke

import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const here = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(here, "..");
const require = createRequire(pathToFileURL(path.join(serverDir, "placeholder.js")));

require("dotenv").config({ path: path.join(serverDir, ".env") });

const mongoose = require(path.join(serverDir, "node_modules/mongoose"));
const app = require(path.join(serverDir, "src/app"));
const db = require(path.join(serverDir, "src/config/db"));

// The connect helper is looked up by shape rather than by a fixed name, so this
// script keeps working while the server is being renamed.
const connect = db.connectDatabase || db.sambungkanDatabase || Object.values(db)[0];

const PORT = 4399;
const BASE = `http://127.0.0.1:${PORT}`;
const results = [];

const check = (name, passed, note = "") => {
  results.push({ name, passed, note });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${note ? "  — " + note : ""}`);
};

async function call(routePath, { method = "GET", token, body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(BASE + routePath, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  let payload = null;
  try { payload = await response.json(); } catch { /* empty body is fine */ }
  return { status: response.status, payload };
}

const { namaDatabase, host } = await connect();
console.log(`Connected to "${namaDatabase}" at ${host}\n`);

const server = app.listen(PORT);
await new Promise((resolve) => server.once("listening", resolve));

const stamp = Date.now();
const alice = { name: "Smoke One", email: `smoke-a-${stamp}@example.test`, password: "secret12345" };
const bob = { name: "Smoke Two", email: `smoke-b-${stamp}@example.test`, password: "secret12345" };

try {
  // ---------- public surface ----------
  let r = await call("/api/health");
  check("GET /api/health", r.status === 200);

  r = await call("/api/public/teaser");
  check("GET /api/public/teaser without a token", r.status === 200 && Array.isArray(r.payload.konten),
    `${r.payload?.jumlahKonten} items, ${r.payload?.jumlahKategori} categories`);
  check("teaser leaks neither body nor videoId",
    r.payload.konten.every((item) => item.body === undefined && item.videoId === undefined));

  r = await call("/api/contents");
  check("GET /api/contents without a token is rejected", r.status === 401);

  // ---------- sign up and sign in ----------
  r = await call("/api/auth/register", { method: "POST", body: alice });
  check("POST /api/auth/register", r.status === 201 && !!r.payload.token);
  const aliceToken = r.payload.token;

  r = await call("/api/auth/register", { method: "POST", body: { ...alice, name: "Duplicate" } });
  check("duplicate email is rejected with 409", r.status === 409);

  r = await call("/api/auth/register", { method: "POST", body: { ...bob, password: "short" } });
  check("password under 8 characters is rejected", r.status === 400);

  r = await call("/api/auth/login", { method: "POST", body: { email: alice.email, password: "wrong-password" } });
  check("wrong password is rejected with 401", r.status === 401);

  r = await call("/api/auth/register", { method: "POST", body: bob });
  const bobToken = r.payload.token;
  check("second account created for the privacy checks", r.status === 201);

  // ---------- content ----------
  r = await call("/api/contents", { token: aliceToken });
  check("GET /api/contents with a token", r.status === 200 && r.payload.total > 0, `${r.payload.total} items`);

  r = await call("/api/contents?category=olahraga", { token: aliceToken });
  check("filter by category", r.status === 200 && r.payload.konten.every((k) => k.category === "olahraga"));

  r = await call("/api/contents?type=video", { token: aliceToken });
  check("filter by type", r.status === 200 && r.payload.konten.every((k) => k.type === "video"));

  r = await call("/api/contents?search=tidur", { token: aliceToken });
  check("search by keyword", r.status === 200, `${r.payload.total} hits`);

  r = await call("/api/categories", { token: aliceToken });
  check("GET /api/categories", r.status === 200 && r.payload.kategori.length === 5);

  const list = (await call("/api/contents", { token: aliceToken })).payload.konten;
  const sample = list[0];
  r = await call(`/api/contents/${sample.slug}`, { token: aliceToken });
  check("GET /api/contents/:slug returns the body", r.status === 200 && !!r.payload.konten.body);

  // ---------- favourites ----------
  r = await call(`/api/favorites/${sample.id}`, { method: "POST", token: aliceToken });
  check("POST /api/favorites/:id", r.status === 201);

  r = await call(`/api/favorites/${sample.id}`, { method: "POST", token: aliceToken });
  check("saving twice stays safe", r.status === 201);

  r = await call("/api/favorites", { token: aliceToken });
  check("owner sees their favourite", r.status === 200 && r.payload.total === 1);

  r = await call("/api/favorites", { token: bobToken });
  check("another user does not see it", r.status === 200 && r.payload.total === 0);

  r = await call(`/api/favorites/${sample.id}`, { method: "DELETE", token: bobToken });
  check("deleting someone else's favourite answers 404", r.status === 404);

  // ---------- daily entries ----------
  r = await call("/api/logs", { method: "POST", token: aliceToken, body: { type: "steps", value: 3120 } });
  check("POST /api/logs steps", r.status === 201);
  const entryId = r.payload.catatan.id;

  r = await call("/api/logs", { method: "POST", token: aliceToken, body: { type: "steps", value: 3120.5 } });
  check("decimal steps rejected", r.status === 400);

  r = await call("/api/logs", { method: "POST", token: aliceToken, body: { type: "sleep", value: 7.1 } });
  check("decimal sleep accepted", r.status === 201);

  r = await call("/api/logs", { method: "POST", token: aliceToken, body: { type: "breathing", value: 3, mood: 3 } });
  check("breathing 3 minutes with a mood", r.status === 201);

  r = await call("/api/logs", { method: "POST", token: aliceToken, body: { type: "breathing", value: 4 } });
  check("breathing 4 minutes rejected", r.status === 400);

  r = await call("/api/logs", { method: "POST", token: aliceToken, body: { type: "steps", value: 100, mood: 3 } });
  check("mood on a non-breathing entry rejected", r.status === 400);

  r = await call("/api/logs", { method: "POST", token: aliceToken, body: { type: "made-up", value: 1 } });
  check("unknown activity type rejected", r.status === 400);

  r = await call("/api/logs", { token: aliceToken });
  check("owner sees exactly their three entries", r.status === 200 && r.payload.total === 3, `${r.payload.total} entries`);

  r = await call("/api/logs", { token: bobToken });
  check("another user sees none of them", r.status === 200 && r.payload.total === 0);

  r = await call(`/api/logs/${entryId}`, { method: "PUT", token: bobToken, body: { value: 9999 } });
  check("editing someone else's entry answers 404", r.status === 404);

  r = await call(`/api/logs/${entryId}`, { method: "DELETE", token: bobToken });
  check("deleting someone else's entry answers 404", r.status === 404);

  r = await call("/api/logs/summary", { token: aliceToken });
  const rings = r.payload.cincin;
  check("GET /api/logs/summary", r.status === 200 && !!rings,
    `move ${rings?.gerak.capaian}/${rings?.gerak.target}, sleep ${rings?.tidur.capaian}/${rings?.tidur.target}, relax ${rings?.relaksasi.capaian}/${rings?.relaksasi.target}`);

  // ---------- profile ----------
  r = await call("/api/auth/me", { method: "PUT", token: aliceToken, body: { name: "Smoke One Renamed", bio: "hello" } });
  check("PUT /api/auth/me", r.status === 200 && r.payload.user.name === "Smoke One Renamed");

  r = await call("/api/auth/password", { method: "PUT", token: aliceToken, body: { passwordLama: "wrong", passwordBaru: "newsecret123" } });
  check("changing the password with a wrong old one is rejected", r.status === 401);

  r = await call("/api/auth/me", { token: aliceToken });
  check("profile never includes passwordHash", r.status === 200 && r.payload.user.passwordHash === undefined);

  r = await call("/api/logs", { token: "not.a.real.token" });
  check("a forged token is rejected", r.status === 401);
} finally {
  // ---------- clean up ----------
  const User = mongoose.model("User");
  const Favorite = mongoose.model("Favorite");
  const HealthLog = mongoose.model("HealthLog");

  const accounts = await User.find({ email: { $in: [alice.email, bob.email] } });
  for (const account of accounts) {
    await Favorite.deleteMany({ userId: account._id });
    await HealthLog.deleteMany({ userId: account._id });
  }
  await User.deleteMany({ email: { $in: [alice.email, bob.email] } });

  const remaining = {
    contents: await mongoose.model("Content").countDocuments(),
    users: await User.countDocuments(),
    favorites: await Favorite.countDocuments(),
    entries: await HealthLog.countDocuments()
  };
  console.log(`\nCleaned up ${accounts.length} test accounts.`);
  console.log(`Database now holds ${remaining.contents} contents, ${remaining.users} users, ${remaining.favorites} favourites, ${remaining.entries} entries.`);

  server.close();
  await mongoose.disconnect();

  const failed = results.filter((r) => !r.passed);
  console.log(`\n${results.length - failed.length} of ${results.length} checks passed.`);
  if (failed.length) {
    console.log("Failed:");
    failed.forEach((f) => console.log("  - " + f.name));
    process.exitCode = 1;
  }
}
