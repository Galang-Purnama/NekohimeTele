export default {
    name: 'games',
    cmd: ['claim'],
    tags: 'rpg',
    run: async ({ conn, m, prefix, text, command }) => {
        let user = db.data.users[m.sender]
const uang = 1000
const roti = 5
const apel = 10
const potion = 5
const coin = 500
const saldo = 250
  let __timers = new Date() - user.lastclaim;
  let _timers = 86400000 - __timers;
  let timers = clockString(_timers);
  if (new Date() - user.lastclaim > 86400000) {
    conn.sendButton(m.chat, `Anda sudah mengklaim dan mendapatkan 
💵 Uang: ${uang}
🍞 Roti: ${roti}
🪙 Coin: ${coin}
🍎 Apel: ${apel}
🧪Potion: ${potion}
💳 Saldo: ${saldo}`, [[set.infoBtn, '/info'], [set.menuBtn, '/menu']], m.repl);
    global.db.data.users[m.sender].money += uang * 1;
    global.db.data.users[m.sender].potion += potion * 1;
    global.db.data.users[m.sender].apel += apel * 1;
    global.db.data.users[m.sender].roti += roti * 1;
    global.db.data.users[m.sender].coin += coin * 1;
    global.db.data.users[m.sender].saldo += saldo * 1;
    global.db.data.users[m.sender].lastclaim = new Date() * 1;
  } else m.reply(`Anda harus menunggu *${timers}* lagi untuk mengklaim.`);
    },
};

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    console.log({ms,h,m,s})
    return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
  }