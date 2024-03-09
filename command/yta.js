import axios from "axios";
export default {
    name: 'yta',
    cmd: ['yta'],
    tags: 'downloader',
    run: async ({ conn, m, text, prefix, command }) => {
        if (!text) return conn.sendMessage(m.chat, 'Masukkan link Youtube', m.send)
        let data = await axios.post(`https://nekohime.xyz/api/downloader/yt-v2`, {url: text, apikey: set.apikey})
        let buff = await axios.get(data.data.result.mp3[0].url, {responseType: 'arraybuffer'})
        const audioBuffer = Buffer.from(buff.data);
        conn.sendAudio(m.chat, audioBuffer, '✅ DONE', m.send, {fileName: data.data.result.title + '.mp3'})
    }
};