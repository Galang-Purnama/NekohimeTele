export default {
    name: 'faq',
    cmd: ['faq'],
    tags: 'main',
    run: async ({ conn, m, prefix, command, commands }) => {
        conn.sendMessage(m.chat, `FAQ Penggunaan Bot Telegram untuk Download (Maksimum 50MB)

1. Bagaimana cara menggunakan bot Telegram untuk download?

Untuk menggunakan bot, mulailah dengan membuka obrolan dengan bot Anda.
Kirimkan perintah atau kata kunci yang sesuai untuk memulai proses pengunduhan.

2. Apakah ada batasan ukuran file untuk pengunduhan menggunakan bot ini?
Ya, bot ini memiliki batasan ukuran file maksimum sebesar 50MB untuk setiap pengunduhan.

3. Bagaimana cara memeriksa ukuran file sebelum mengunduh?
Bot ini menyediakan opsi untuk melihat ukuran file sebelum mengonfirmasi pengunduhan.

4. Bagaimana jika file yang ingin saya unduh melebihi batasan 50MB?
Jika file melebihi batasan, pertimbangkan untuk mengompres file atau membaginya menjadi bagian yang lebih kecil sebelum menggunakan bot.

5. Apakah ada cara untuk meningkatkan kecepatan pengunduhan?
Kecepatan pengunduhan tergantung pada beberapa faktor, termasuk server bot dan koneksi pengguna. Pastikan koneksi internet Anda stabil untuk hasil terbaik.`, m.repl)
    }
};