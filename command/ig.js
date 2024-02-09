import axios from "axios";
export default {
    name: 'instagram',
    cmd: ['instagram', 'ig', 'igdl'],
    tags: 'downloader',
    run: async ({ conn, m, prefix, text, command }) => {
        if (!text) return m.reply('Url nya mana ?')
        const response = await axios.post('https://nekohime.xyz/api/downloader/igdownloader', {url: text, apikey: set.apikey})
        if (response.data.status) {
      const result = response.data.result;
      const dataArray = result.data;
      for (const data of dataArray) {
        const downloadUrl = data.url;
        await conn.sendFile(m.chat, downloadUrl, 'Sukses', m);
      }
        }
    },
};