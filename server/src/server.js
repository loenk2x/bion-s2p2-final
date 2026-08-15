require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/db");

const port = process.env.PORT || 4000;

(async () => {
  try {
    const { databaseName, host } = await connectDatabase();
    console.log(`Database tersambung: ${databaseName} di ${host}`);
    app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));
  } catch (error) {
    console.error("Gagal menyalakan server:", error.message);
    process.exit(1);
  }
})();
