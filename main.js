// main.js
import './handler.js'
import { conn, serialize } from './lib/simple.js';
import { readdirSync } from 'fs';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'node:url';
import updateLogger from 'telegraf-update-logger';
import chalk from 'chalk';
import axios from 'axios';

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
        method: method.toLowerCase(), // Menyamakan dengan metode HTTP yang dibutuhkan (get, post, dll.)
        url: baseUrl,
        ...(method.toLowerCase() === 'get' ? { params: data } : { data: data }), // Menyesuaikan dengan jenis metode
        headers: headers,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  }

  commands.forEach((command) => {
    if (command && command.cmd && command.run) {
      conn.command(command.cmd, async (ctx) => {
        const serializedContext = serialize(ctx, conn);
        const [cmd, ...args] = ctx.message.text.split(/\s+/);
        const textAfterCommand = args.join(' ');
        await command.run({conn, m: serializedContext, prefix: '/', text: textAfterCommand || undefined, command: cmd,});
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
