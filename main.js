// main.js
import './handler.js'
import { conn, serialize } from './lib/simple.js';
import { readdirSync } from 'fs';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'node:url';
import updateLogger from 'telegraf-update-logger';
import chalk from 'chalk';
import axios from 'axios';
import lodash from 'lodash'
import fs from 'fs'
import { dbUser, dbChat } from './handler.js'
// Fungsi untuk membaca berkas-berkas di dalam folder command
async function loadCommands() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const commandFiles = readdirSync(join(__dirname, 'command')).filter((file) => file.endsWith('.js'));

  const commands = await Promise.all(commandFiles.map(async (file) => {
    const modulePath = `./command/${file}`;
    const commandModule = await import(modulePath);
    return commandModule.default || commandModule;
  }));

  global.API = async (baseUrl, data = {}, headers = {}, method = 'get',) => {
    try {
      const response = await axios({
        method: method.toLowerCase(),
        url: baseUrl,
        ...(method.toLowerCase() === 'get' ? { params: data } : { data: data }),
        headers: headers,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  }

  // DATABASE
  var low;
  try {
    low = await import('lowdb');
  } catch (e) {
    low = await import('./lib/lowdb.js');
  }
  const { LowSync, JSONFileSync } = low;
  if (!fs.existsSync('./database.json')) {
    fs.writeFileSync('./database.json', '{}');
  }
  const adapter = new JSONFileSync('./database.json'); 
  global.db = new LowSync(adapter); 
  global.DATABASE = global.db;
  global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000));
    if (!global.db.data) {
      global.db.data = {
        users: {},
        chats: {},
        settings: {},
        stats: {}
      };
      await global.db.write();
    } else {
      global.db.READ = true;
      await global.db.read();
      global.db.READ = false;
    }
    global.db.chain = lodash.chain(global.db.data);
  };
  loadDatabase();

  if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write();
  }, 3 * 1000);

  commands.forEach((command) => {
    if (command && command.cmd && command.run) {
      conn.command(command.cmd, async (ctx) => {
        await global.loadDatabase();
        const userId = ctx.from.id.toString();
        const chatId = ctx.from.id.toString();
        dbUser(userId)
        dbChat(chatId)
        const serializedContext = serialize(ctx, conn);
        const [cmd, ...args] = ctx.message.text.split(/\s+/);
        const textAfterCommand = args.join(' ');
        await command.run({conn, m: serializedContext, prefix: '/', text: textAfterCommand || undefined, command: cmd, args: args});
      });
    }
  });
  
}

conn.use(
updateLogger({
colors: {
id: chalk.red,
chat: chalk.yellow,
user: chalk.green,
type: chalk.bold,}}));

// Tanggapi perintah /start
conn.start((ctx) => {
  ctx.reply('Halo! Aku adalah bot Telegram sederhana. Cobalah kirim pesan /menu');
});

// Memuat perintah dari berkas di dalam folder command
loadCommands().then(() => {
  // Jalankan bot setelah selesai memuat perintah
  conn.launch().then(() => {
    console.log('Bot is running...');
  }).catch((err) => {
    console.error('Error starting bot:', err);
  });
}).catch((err) => {
  console.error('Error loading commands:', err);
});
