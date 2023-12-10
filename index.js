import path, { join, dirname } from 'path';
import gradient from 'gradient-string';
const { pastel } = gradient;
import { spawn } from 'child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

  let duck = pastel.multiline(
    [
      "───▄▀▀▀▄▄▄▄▄▄▄▀▀▀▄───",
      "───█▒▒░░░░░░░░░▒▒█───",
      "────█░░█░░░░░█░░█────",
      "─▄▄──█░░░▀█▀░░░█──▄▄─",
      "█░░█─▀▄░░░░░░░▄▀─█░░█",
      "█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█",
      "█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█",
      "█░░║║║╠─║─║─║║║║║╠─░░█",
      "█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█",
      "█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█",
    ].join("\n")
  );
  console.log(duck);
  console.log("\n======================================\nScript by : Galang Purnama\nInstagram : galangpurnama.my.id\nGithub: Galang-Purnama\nTelegram: @GalangP_Dev\n======================================\n")
  function start(fileName) {
  const childProcess = spawn('node', [fileName], {
    cwd: __dirname,
    stdio: 'inherit',
  });

  childProcess.on('error', (err) => {
    console.error(`Error starting ${fileName}:`, err.message);
  });
}

// Contoh pemanggilan: memulai 'main.js'
start('main.js');
