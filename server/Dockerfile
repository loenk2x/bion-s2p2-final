# Dockerfile untuk pengembangan server Healthy Life.
# Menjalankan mode dev (node --watch), bukan build produksi.
# Untuk deployment produksi, server dijalankan langsung di Render lewat render.yaml,
# tanpa image ini.

FROM node:22-alpine

WORKDIR /app

# Salin berkas dependensi lebih dulu supaya lapisan cache Docker terpakai ulang
# selama package.json tidak berubah.
COPY package*.json ./
RUN npm install

# Kode sumber ikut disalin supaya image tetap bisa jalan sendiri, tapi saat dipakai
# lewat docker-compose, folder ini akan ditimpa bind mount dari server/ di host.
COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
