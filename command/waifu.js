import axios from "axios";

export default {
    name: 'waifu',
    cmd: ['waifu'],
    tags: 'anime',
    run: async ({ conn, m, prefix, command, commands }) => {
        const callbackData = hash(10)
        let img = await axios.get('https://api.waifu.pics/sfw/waifu');
        conn.sendUrlButtonImg(m.chat, img.data.url, 'Sukses', [['Instagram', 'https://instagram.com/galangpurnama.my.id'], ['☰ LAGI', callbackData], ['☰ MENU', '/menu']], m.repl);
        // Wajib di add ketika ingin membuat gambar baru
        conn.action(callbackData, async (ctx) => {
            img = await axios.get('https://api.waifu.pics/sfw/waifu');
            conn.sendUrlButtonImg(m.chat, img.data.url, 'Sukses', [['Lagi', callbackData]], m.repl);
        });
    },
};

function hash(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
