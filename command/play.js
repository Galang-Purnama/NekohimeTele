import axios from "axios";
export default {
    name: 'ytplay',
    cmd: ['play'],
    tags: 'downloader',
    run: async ({ conn, m, text, prefix, command }) => {
        if (!text) return m.reply('Masukkan link Youtube')
        let data = await axios.post(`https://nekohime.xyz/api/downloader/yt-v2`, {url: text, apikey: set.apikey})
                const maxDescLength = 250;
        const truncatedDesc = data.data.result.desc.length > maxDescLength ? data.data.result.desc.substring(0, maxDescLength) + '...' : data.data.result.desc;
    conn.sendButtonImg(m.chat, data.data.result.thumb, `🎬 YouTube Play
📌 Judul: ${data.data.result.title}
👁️ Penonton: ${data.data.result.view}
⏲️ Diunggah: ${data.data.result.uploadDate}
👑 Nama Pembuat: ${data.data.result.channel}
🚀 Sumber: ${text}
📝 Deksripsi: ${truncatedDesc}`, [['Audio', `/yta ${text}`], ['Video', `/ytv ${text}`]], m.send)
    },
};
