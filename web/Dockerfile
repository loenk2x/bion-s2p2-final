# Dockerfile untuk pengembangan aplikasi web Healthy Life.
# Menjalankan Vite dev server, bukan build produksi.
# Untuk deployment produksi, web dibangun lewat Netlify memakai web/netlify.toml,
# tanpa image ini.

FROM node:22-alpine

WORKDIR /app

# Salin berkas dependensi lebih dulu supaya lapisan cache Docker terpakai ulang
# selama package.json tidak berubah.
COPY package*.json ./
RUN npm install

# Kode sumber ikut disalin supaya image tetap bisa jalan sendiri, tapi saat dipakai
# lewat docker-compose, folder ini akan ditimpa bind mount dari web/ di host.
COPY . .

EXPOSE 5173

# Skrip "dev" di package.json sudah memakai "vite --host", supaya Vite bisa
# dihubungi dari luar kontainer, bukan hanya dari dalamnya.
CMD ["npm", "run", "dev"]
