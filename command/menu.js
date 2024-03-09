// menu.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function toUpper(query) {
  const arr = query.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  return arr.join(" ");
}

export default {
  name: 'menu',
  cmd: ['menu'],
  tags: 'main',
  desc: 'To display the menu by list, and see how to use the menu',
  run: async ({ conn, m, prefix, command }) => {
    try {
      const commandFolder = join(__dirname);
      const commandFiles = readdirSync(commandFolder).filter(file => file.endsWith('.js'));

      const allCommands = [];
      for (const file of commandFiles) {
        const modulePath = join(commandFolder, file);
        const { default: commandModule } = await import(`file:///${modulePath}`);
        allCommands.push(commandModule);
      }

      let menuText = `Selamat datang di Nekohime BOT\nbot ini masih dalam tahap beta\nINFO MENU:\n 🅟 : Khusus Premium\n 🅛 : Memakai Limit\n\n𖢖 ═══ Nekohime BOT ═══ 𖢖\n✬ Version: 1.0.3\n✬ Library: Telegraf\n✬ Server: Localhost\n\n`;

      const groupedCommands = {};

      allCommands.forEach(cmd => {
        if (cmd.tags) {
          const tags = toUpper(cmd.tags);
          if (!groupedCommands[tags]) {
            groupedCommands[tags] = [];
          }

          if (cmd.cmd && cmd.cmd.length > 0) {
            groupedCommands[tags].push(cmd.cmd.map(c => `${prefix + c}`).join('\n'));
          }
        }
      });

      Object.entries(groupedCommands).forEach(([tag, commands]) => {
        menuText += `⦿ ${tag}\n${commands.join('\n')}\n\n`;
      });

      conn.sendButtonUrl(m.chat, menuText, [['Instagram', 'https://instagram.com/galangpurnama.my.id'], [set.infoBtn, '/info'], [set.menuBtn, '/menu']], m.send);

    } catch (error) {
      console.error('Error displaying menu:', error);
    }
  },
};
