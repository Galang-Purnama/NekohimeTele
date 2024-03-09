export default {
    name: 'games',
    cmd: ['monthly'],
    tags: 'rpg',
    run: async ({ conn, m, prefix, text, command }) => {
const uang = 100000
const roti = 100
const apel = 40
const koin = 5000
const legendary = 10
const gold_ticket = 3
const saldo = 12000
    let user = db.data.users[m.sender]
    let _timers = (2592000000 - (new Date - user.lastmonthly))
    let timers = clockString(_timers) 
    if (new Date - user.lastmonthly > 2592000000) {
    conn.sendButton(m.chat, `Anda sudah mengklaim dan mendapatkan 
💵Uang: ${uang}
🎟️ Tiket Emas: ${gold_ticket}
🍞 Roti: ${roti}
🍎 Apel: ${apel}
🪙 Koin: ${koin}
🎁 Legendary: ${legendary}
💳 Saldo: ${saldo}`, [[set.menuBtn, '/menu']], m.send)
        user.money += uang * 1
        user.legendary += legendary * 1
        user.coin += koin * 1
        user.apel += apel * 1
        user.gold_ticket += gold_ticket * 1
        user.roti += roti * 1
        user.saldo += saldo * 1
        user.lastmonthly = new Date * 1
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