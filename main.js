// main.js
import { conn, serialize } from './lib/simple.js';
import { readdirSync } from 'fs';
import path, { join, dirname } from 'path';
import { fileURLToPath } from 'node:url';

// Fungsi untuk membaca berkas-berkas di dalam folder command
async function loadCommands() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const commandFiles = readdirSync(join(__dirname, 'command')).filter((file) => file.endsWith('.js'));

  const commands = await Promise.all(commandFiles.map(async (file) => {
    const modulePath = `./command/${file}`;
    const commandModule = await import(modulePath);
    return commandModule.default || commandModule;
  }));

  commands.forEach((command) => {
    if (command && command.cmd && command.run) {
      conn.command(command.cmd, async (ctx) => {
        const serializedContext = serialize(ctx, conn); // Serialisasi context
        await command.run({ conn, m: serializedContext, prefix: '/', command, commands });
      });
    }
  });
}

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
