import axios from "axios";
export default {
    name: 'tiktok',
    cmd: ['tiktok', 'tt', 'ttdl'],
    tags: 'downloader',
    run: async ({ conn, m, prefix, text, command }) => {
        if (!text) return m.reply('Url nya mana ?')
        let vid = await API('https://nekohime.xyz/api/downloader/tiktok', {url: text, apikey: set.apikey})
        if (vid.result.type === 'video') {
          const videoUrl = vid.result.video[0];
          conn.sendVideo(m.chat, videoUrl, 'Sukses', m.repl);
        } else if (vid.result.type === 'image') {
          const imageUrls = vid.result.images;
          for (const imageUrl of imageUrls) {
            conn.sendImage(m.chat, imageUrl, 'Sukses', m.repl);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
    },
};