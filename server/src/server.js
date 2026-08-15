require("dotenv").config();

const app = require("./app");
const { sambungkanDatabase } = require("./config/db");

const port = process.env.PORT || 4000;

(async () => {
  try {
    const { namaDatabase, host } = await sambungkanDatabase();
    console.log(`Database tersambung: ${namaDatabase} di ${host}`);
    app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));
  } catch (galat) {
    console.error("Gagal menyalakan server:", galat.message);
    process.exit(1);
  }
})();
