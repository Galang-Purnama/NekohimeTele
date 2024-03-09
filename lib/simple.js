import { Telegraf } from 'telegraf';
import fs from 'fs'
import Stream, {
	Readable
} from 'stream'
import { readdirSync } from 'fs';
import fetch from 'node-fetch';
import { fileTypeFromBuffer, fileTypeStream } from 'file-type';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'node:url';
import uploadImage from './uploadImage.js'
import { Pomf2Uploader } from "./pomf.js"
const conn = new Telegraf('6887124659:AAF0FixpmIQiTQtzr2yznUjL6GvHaimkP2o');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

        conn.sendMessage = async (jid, text, quoted) => {
            return conn.telegram.sendMessage(jid, text, { reply_to_message_id: quoted });
        }

    conn.getFile = async (PATH, returnAsFilename) => {
        let res, filename
				let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
				if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
				let type = await fileTypeFromBuffer(data) || {
					mime: 'application/octet-stream',
					ext: '.bin'
				}
				if (data && returnAsFilename && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
				return {
					res,
					filename,
					...type,
					data
        }
            }


// ======================================= FUNCTION ================================== //
    conn.pickRandom = async (list) => {
      return list[Math.floor(list.length * Math.random())]
    }

    conn.sendFile = async (jid, file, caption, quoted) => {
        try {
            let link;
    
            if (/^https:\/\//i.test(file) || /^http:\/\//i.test(file)) {
                link = file;
            } else {
                try {
                    link = await (uploadImage)(file);
                } catch (uploadError) {
                    console.error('Error uploading to file hosting:', uploadError);
                    link = await Pomf2Uploader(file);
                }
            }
    
            const fileType = await getFileType(link);
    
            if (['jpg', 'jpeg', 'png'].includes(fileType)) {
                await conn.telegram.sendPhoto(jid, link, { caption, reply_to_message_id: quoted });
            } else if (['mp4', 'mkv', 'webm'].includes(fileType)) {
                await conn.telegram.sendVideo(jid, link, { caption, reply_to_message_id: quoted });
            } else {
                await conn.telegram.sendDocument(jid, link, { caption, reply_to_message_id: quoted });
            }
        } catch (error) {
            console.error('Error sending file:', error);
            return null;
        }
    };

    conn.sendVideo = async (jid, urlOrBuffer, caption, quoted, options = {}) => {
      const link = /^https?:\/\//i.test(urlOrBuffer) ? urlOrBuffer : undefined;
      if (link) {
        await conn.telegram.sendVideo(jid, link, {
          ...options,
          caption,
          reply_to_message_id: quoted,
        });
      } else {
        await conn.telegram.sendVideo(jid, { source: Buffer.from(urlOrBuffer) }, {
          ...options,
          caption,
          reply_to_message_id: quoted,
        });
      }
    }

    conn.sendImage = async (jid, urlOrBuffer, caption, quoted, options = {}) => {
      const link = /^https?:\/\//i.test(urlOrBuffer) ? urlOrBuffer : undefined;
      if (link) {
        await conn.telegram.sendPhoto(jid, link, {
          ...options,
          caption,
          reply_to_message_id: quoted,
        });
      } else {
        await conn.telegram.sendPhoto(jid, { source: Buffer.from(urlOrBuffer) }, {
          ...options,
          caption,
          reply_to_message_id: quoted,
        });
      }
    }

// ======================================= Keyboard ================================== //

    conn.deleteKeyboard = async (jid, caption, quoted, options = {}) => {
    try {
        await conn.telegram.sendMessage(jid, caption, {
            reply_to_message_id: quoted,
            ...options,
            reply_markup: {
                remove_keyboard: true,
            },
        });
        conn.use(async (ctx, next) => {
            return next();
        });
    } catch (error) {
        console.error('Error sending button:', error);
    }
  };

    conn.keyboard = async (jid, caption, keyboardBtn, quoted, options = {}) => {
      try {
      const keyboardMarkup = {
          keyboard: keyboardBtn.map(button => [
              {
                  text: button[0],
              },
          ]),
          resize_keyboard: true
      };

      await conn.telegram.sendMessage(jid, caption, {
          reply_to_message_id: quoted,
          reply_markup: keyboardMarkup,
          ...options,
      });

      conn.use(async (ctx, next) => {
        if (ctx.update.message && ctx.update.message.text) {
            const textMessage = ctx.update.message.text;
            const matchingButton = keyboardBtn.find(button => button[0] === textMessage);
    
            if (matchingButton) {
                const callbackData = matchingButton[1];
                const command = callbackData.replace(/^\//, '');
                const prefix = '/';
                const loadedCommands = await loadCommands();
    
                if (loadedCommands[command]) {
                    try {
                        await loadedCommands[command]({
                            conn,
                            m: {
                                chat: ctx.update.message.chat.id,
                                repl: ctx.update.message.message_id
                            },
                            prefix,
                            command,
                            commands: loadedCommands,
                        });
                    } catch (error) {
                        console.error(`Error executing command ${command}:`, error);
                    }
                } else {
                    console.error(`Command not found: ${command}`);
                }
            }
        }
        if (ctx.update.callback_query) {
            const callbackData = ctx.update.callback_query.data;
            const command = callbackData.replace(/^\//, '');
            const prefix = '/';
            const loadedCommands = await loadCommands();
    
            if (loadedCommands[command]) {
                try {
                    await loadedCommands[command]({
                        conn,
                        m: {
                            chat: ctx.update.callback_query.message.chat.id,
                            repl: ctx.update.callback_query.message.message_id
                        },
                        prefix,
                        command,
                        commands: loadedCommands,
                    });
                } catch (error) {
                    console.error(`Error executing command ${command}:`, error);
                }
            } else {
                console.error(`Command not found: ${command}`);
            }
        }
    
        // Continue to the next middleware or handler
        return next();
    });    
  } catch (error) {
      console.error('Error sending button:', error);
  }
};

  
// ======================================= Button ================================== //

  conn.sendButtonImg = async (jid, bufferOrUrl, caption, buttons, quoted, options = {}) => {
    try {
        const buttonMarkup = {
            inline_keyboard: buttons.map(button => [
                {
                    text: button[0],
                    callback_data: button[1],
                },
            ]),
        };
        const link = /^https?:\/\//i.test(bufferOrUrl) ? bufferOrUrl : undefined;
      if (link) {
        await conn.telegram.sendPhoto(jid, link, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      } else {
        await conn.telegram.sendPhoto(jid, { source: Buffer.from(bufferOrUrl) }, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      }

        for (const button of buttons) {
            const callbackData = button[1];
            conn.action(callbackData, async (ctx) => {
                const command = callbackData.replace(/^\//, '');
                const prefix = '/';
                ctx.answerCbQuery();
                const loadedCommands = await loadCommands();
                if (loadedCommands[command]) {
                    try {
                        await loadedCommands[command]({
                            conn,
                            m: {
                            chat: ctx.update.callback_query.message.chat.id,
                            repl: ctx.update.callback_query.message.reply_to_message.message_id},
                            prefix,
                            command,
                            commands: loadedCommands,
                        });
                    } catch (error) {
                        console.error(`Error executing command ${command}:`, error);
                    }
                } else {
                    console.error(`Command not found: ${command}`);
                }
            });
        }
    } catch (error) {
        console.error('Error sending button with image:', error);
    }
}

  conn.sendButtonVid = async (jid, bufferOrUrl, caption, buttons, quoted, options = {}) => {
    try {
        const buttonMarkup = {
            inline_keyboard: buttons.map(button => [
                {
                    text: button[0],
                    callback_data: button[1],
                },
            ]),
        };
        const link = /^https?:\/\//i.test(bufferOrUrl) ? bufferOrUrl : undefined;
      if (link) {
        await conn.telegram.sendVideo(jid, link, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      } else {
        await conn.telegram.sendVideo(jid, { source: Buffer.from(bufferOrUrl) }, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      }

        for (const button of buttons) {
            const callbackData = button[1];
            conn.action(callbackData, async (ctx) => {
                const command = callbackData.replace(/^\//, '');
                const prefix = '/';
                ctx.answerCbQuery();
                const loadedCommands = await loadCommands();
                if (loadedCommands[command]) {
                    try {
                        await loadedCommands[command]({
                            conn,
                            m: {
                            chat: ctx.update.callback_query.message.chat.id,
                            repl: ctx.update.callback_query.message.reply_to_message.message_id},
                            prefix,
                            command,
                            commands: loadedCommands,
                        });
                    } catch (error) {
                        console.error(`Error executing command ${command}:`, error);
                    }
                } else {
                    console.error(`Command not found: ${command}`);
                }
            });
        }
    } catch (error) {
        console.error('Error sending button with image:', error);
    }
}

  conn.sendButton = async (jid, caption, buttons, quoted, options = {}) => {
    try {
        const buttonMarkup = {
            inline_keyboard: buttons.map(button => [
                {
                    text: button[0],
                    callback_data: button[1],
                },
            ]),
        };
        await conn.telegram.sendMessage(jid, caption, {
            reply_to_message_id: quoted,
            reply_markup: buttonMarkup,
            ...options,
        });

        for (const button of buttons) {
            const callbackData = button[1];
            conn.action(callbackData, async (ctx) => {
                const command = callbackData.replace(/^\//, '');
                const prefix = '/';
                ctx.answerCbQuery();
                const loadedCommands = await loadCommands();
                if (loadedCommands[command]) {
                    try {
                        await loadedCommands[command]({
                            conn,
                            m: {
                            chat: ctx.update.callback_query.message.chat.id,
                            repl: ctx.update.callback_query.message.reply_to_message.message_id},
                            prefix,
                            command,
                            commands: loadedCommands,
                        });
                    } catch (error) {
                        console.error(`Error executing command ${command}:`, error);
                    }
                } else {
                    console.error(`Command not found: ${command}`);
                }
            });
        }
    } catch (error) {
        console.error('Error sending button:', error);
    }
};

// ======================================= Url Button ================================== //

conn.sendButtonUrl = async (jid, caption, buttons, quoted, options = {}) => {
    try {
      const hasUrl = buttons.some(button => button[1].startsWith('http'));
      const buttonMarkup = {
        inline_keyboard: buttons.map((button) => {
          const buttonConfig = {
            text: button[0],
            callback_data: button[1],
          };
          if (hasUrl && button[1].startsWith('http')) {
            buttonConfig.url = button[1];
          }
  
          return [buttonConfig];
        }),
      };
      await conn.telegram.sendMessage(jid, caption, {
        reply_to_message_id: quoted,
        reply_markup: buttonMarkup,
        ...options,
      });
      for (const button of buttons) {
        const callbackData = button[1];
        conn.action(callbackData, async (ctx) => {
          const command = callbackData.replace(/^\//, '');
          const prefix = '/';
          ctx.answerCbQuery();
          const loadedCommands = await loadCommands();
          if (loadedCommands[command]) {
            try {
              await loadedCommands[command]({
                conn,
                m: {
                  chat: ctx.update.callback_query.message.chat.id,
                  repl: ctx.update.callback_query.message.reply_to_message.message_id,
                },
                prefix,
                command,
                commands: loadedCommands,
              });
            } catch (error) {
              console.error(`Error executing command ${command}:`, error);
            }
          } else {
            console.error(`Command not found: ${command}`);
          }
        });
      }
    } catch (error) {
      console.error('Error sending button with URL:', error);
    }
  };

  conn.sendUrlButtonImg = async (jid, bufferOrUrl, caption, buttons, quoted, options = {}) => {
    try {
      const hasUrl = buttons.some(button => button[1].startsWith('http'));
      const buttonMarkup = {
        inline_keyboard: buttons.map((button) => {
          const buttonConfig = {
            text: button[0],
            callback_data: button[1],
          };
          if (hasUrl && button[1].startsWith('http')) {
            buttonConfig.url = button[1];
          }
  
          return [buttonConfig];
        }),
      };
      const link = /^https?:\/\//i.test(bufferOrUrl) ? bufferOrUrl : undefined;
      if (link) {
        await conn.telegram.sendPhoto(jid, link, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      } else {
        await conn.telegram.sendPhoto(jid, { source: Buffer.from(bufferOrUrl) }, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      }
  
      for (const button of buttons) {
        const callbackData = button[1];
        conn.action(callbackData, async (ctx) => {
          const command = callbackData.replace(/^\//, '');
          const prefix = '/';
          ctx.answerCbQuery();
          const loadedCommands = await loadCommands();
          if (loadedCommands[command]) {
            try {
              await loadedCommands[command]({
                conn,
                m: {
                  chat: ctx.update.callback_query.message.chat.id,
                  repl: ctx.update.callback_query.message.reply_to_message.message_id,
                },
                prefix,
                command,
                commands: loadedCommands,
              });
            } catch (error) {
              console.error(`Error executing command ${command}:`, error);
            }
          } else {
            console.error(`Command not found: ${command}`);
          }
        });
      }
    } catch (error) {
      console.error('Error sending button with URL and image:', error);
    }
  };
  
  conn.sendUrlButtonVid = async (jid, bufferOrUrl, caption, buttons, quoted, options = {}) => {
    try {
      const hasUrl = buttons.some(button => button[1].startsWith('http'));
      const buttonMarkup = {
        inline_keyboard: buttons.map((button) => {
          const buttonConfig = {
            text: button[0],
            callback_data: button[1],
          };
          if (hasUrl && button[1].startsWith('http')) {
            buttonConfig.url = button[1];
          }
  
          return [buttonConfig];
        }),
      };
      const link = /^https?:\/\//i.test(bufferOrUrl) ? bufferOrUrl : undefined;
      if (link) {
        await conn.telegram.sendVideo(jid, link, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      } else {
        await conn.telegram.sendVideo(jid, { source: Buffer.from(bufferOrUrl) }, {
          ...options,
          caption,
          reply_markup: buttonMarkup,
          reply_to_message_id: quoted,
        });
      }
  
      for (const button of buttons) {
        const callbackData = button[1];
        conn.action(callbackData, async (ctx) => {
          const command = callbackData.replace(/^\//, '');
          const prefix = '/';
          ctx.answerCbQuery();
          const loadedCommands = await loadCommands();
          if (loadedCommands[command]) {
            try {
              await loadedCommands[command]({
                conn,
                m: {
                  chat: ctx.update.callback_query.message.chat.id,
                  repl: ctx.update.callback_query.message.reply_to_message.message_id,
                },
                prefix,
                command,
                commands: loadedCommands,
              });
            } catch (error) {
              console.error(`Error executing command ${command}:`, error);
            }
          } else {
            console.error(`Command not found: ${command}`);
          }
        });
      }
    } catch (error) {
      console.error('Error sending button with URL and image:', error);
    }
  };
  

// serialize
export function serialize(m, conn, ctx) {
  return {
    conn,
    chat: m.chat.id,
    repl: m.update.message.message_id,
    sender: m.update.message.from.id,
    username: m.update.message.from.username,
    reply: (text, options) => {
      conn.telegram.sendMessage(m.chat.id, text, {
        reply_to_message_id: m.update.message.message_id,
        ...options,
      });
    },
  };
}


function hash(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  async function loadCommands() {
    const commandFolder = join(__dirname, '..', 'command');
    const commandFiles = readdirSync(commandFolder);

    const allCommands = {};
    for (const file of commandFiles) {
        const modulePath = join(commandFolder, file);
        try {
            const { default: commandModule } = await import(`../command/${file}`);
            if (commandModule.cmd && commandModule.run) {
                for (const cmd of commandModule.cmd) {
                    allCommands[cmd] = commandModule.run;
                }
            } else {
                console.error(`Missing cmd or run property in module ${modulePath}`);
            }
        } catch (error) {
            console.error(`Error importing module ${modulePath}:`, error);
        }
    }
    return allCommands;
}
  const getFileType = async (linkOrPath) => {
    try {
      const buffer = await fetch(linkOrPath).then(res => res.buffer());
      const result = await fileTypeFromBuffer(buffer);
      return result?.ext || 'unknown';
    } catch (error) {
      console.error('Error getting file type:', error);
      return 'unknown';
    }
  };
  var isReadableStream = (stream) => {
	if (typeof Stream.isReadable === 'function') return Stream.isReadable(stream)
	if (stream && stream[Readable] != null) return stream[Readable];
	if (typeof stream?.readable !== 'boolean') return null;
	if (isDestroyed(stream)) return false;
	return (
		isReadableStream(stream) &&
		!!stream.readable &&
		!isReadableFinished(stream)
	) || stream instanceof fs.ReadStream || stream instanceof Readable;
}
export { conn }