const express = require("express");
const { ExpressPeerServer } = require("peer");
const http = require("http");

const app = express();
const server = http.createServer(app);

// API key yang valid - bisa dari env variable biar aman
const VALID_API_KEY = process.env.API_KEY || "rahasia123";

// Buat PeerServer dengan konfigurasi validasi API key
const peerServer = ExpressPeerServer(server, {
  path: "/", // nanti client konek ke path /
  // Fungsi dipanggil saat ada koneksi baru via WebSocket upgrade
  validateClient: (req) => {
    // Ambil query parameter 'apikey' dari URL upgrade WebSocket
    const url = new URL(req.url, `http://${req.headers.host}`);
    const apiKey = url.searchParams.get("apikey");
    // Return true kalau API key cocok
    return apiKey === VALID_API_KEY;
  },
});

// Gunakan peerServer di Express di path / (wajib sama dengan path di atas)
app.use("/", peerServer);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`PeerJS server berjalan di port ${PORT}`);
});
