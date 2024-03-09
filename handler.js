global.set = {
    menuBtn: '☰ MENU',
    infoBtn: '☰ INFO',
    pingBtn: '☰ PING',
    faktaBtn: '☰ FAKTA',
    apikey: '' // Silahkan registrasi di https://nekohime.xyz/signup
}
export const dbUser = function dbUser(userId) {
    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = { health: 100, 
        exp: 10, 
        money: 0, 
        potion: 0, 
        lastclaim: 0,
        roti: 0, 
        apel: 0,
        coin: 0, 
        saldo: 0, 
        antimalingTime: 0,
        antimaling3: 0,
        antimaling5: 0,
        antimaling7: 0,
        antimaling10: 0,
        antimaling30: 0,
        antimaling: false,
        common: 0,
        uncommon: 0,
        mythic: 0,
        legendary: 0,
        pet: 0,
        epic: 0,
        legend: 0,};
      global.db.write();
    }
  };

export const dbChat = function dbChat(chatId) {
    if (!global.db.data.chats[chatId]) {
        global.db.data.chats[chatId] = {
            isBanned: false,
            welcome: false,
            detect: false,
            sWelcome: '',
            sBye: '',
            sPromote: '',
            sDemote: '',
            delete: false,
            antiLink: false,
            expired: 0,
          }
      global.db.write();
    }
  };