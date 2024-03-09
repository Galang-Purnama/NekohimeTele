import { serialize } from './lib/simple.js'
global.set = {
  owner: '', //Id telegram kamu
    menuBtn: '☰ MENU',
    infoBtn: '☰ INFO',
    pingBtn: '☰ PING',
    faktaBtn: '☰ FAKTA',
    apikey: '' // Silahkan registrasi di https://nekohime.xyz/signup
}
var isNumber = x => typeof x === 'number' && !isNaN(x)
export const handler = function handler(ctx) {
  var m = serialize(ctx);
  try {
  var user = db.data.users[m.sender]
  if (typeof user !== 'object')
    db.data.users[m.sender] = {}
  if (user) {
            if (!isNumber(user.healt)) user.healt = 0
            if (!isNumber(user.level)) user.level = 0
            if (!isNumber(user.exp)) user.exp = 0
            if (!isNumber(user.sword)) user.sword = 0
            if (!isNumber(user.potion)) user.potion = 0
            if (!isNumber(user.money)) user.money = 0
            if (!isNumber(user.coin)) user.coin = 0
            if (!isNumber(user.lastdaily)) user.lastdaily = 0
            if (!isNumber(user.lastweekly)) user.lastweekly = 0
            if (!isNumber(user.lastmonthly)) user.lastmonthly = 0
            if (!isNumber(user.common)) user.common = 0
            if (!isNumber(user.uncommon)) user.uncommon = 0
            if (!isNumber(user.mythic)) user.mythic = 0
            if (!isNumber(user.legendary)) user.legendary = 0
            if (!isNumber(user.epic)) user.epic = 0
            if (!isNumber(user.saldoATM)) user.saldoATM = 0
            if (!isNumber(user.apel)) user.apel = 0
            if (!isNumber(user.roti)) user.roti = 0
            if (!isNumber(user.gold_ticket)) user.gold_ticket = 0
            if (!isNumber(user.blue_ticket)) user.blue_ticket = 0
          } else global.db.data.users[m.sender] = {
            healt: 100,
            level: 0,
            exp: 0,
            potion: 0,
            money: 0, 
            coin: 0,
            lastdaily: 0,
            lastweekly: 0,
            lastmonthly: 0,
            common: 0,
            uncommon: 0,
            mythic: 0,
            legendary: 0,
            epic: 0,
            apel: 0,
            saldoATM: 0,
            roti: 0,
            gold_ticket: 0,
            blue_ticket: 0
          }
          
          let chat = global.db.data.chats[m.chat]
              if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
              if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false
                if (!('welcome' in chat)) chat.welcome = false
                if (!('expired' in chat)) chat.expired = 0
                if (!('detect' in chat)) chat.detect = false
                if (!('sWelcome' in chat)) chat.sWelcome = ''
                if (!('sBye' in chat)) chat.sBye = ''
                if (!('sPromote' in chat)) chat.sPromote = ''
                if (!('sDemote' in chat)) chat.sDemote = ''
                if (!('delete' in chat)) chat.delete = false
                if (!('antiLink' in chat)) chat.antiLink = false
              } else global.db.data.chats[m.chat] = {
                isBanned: false,
                welcome: false,
                detect: false,
                sWelcome: '',
                sBye: '',
                sPromote: '',
                sDemote: '',
                delete: false,
                antiLink: false,
              }
          let settings = global.db.data.settings[ctx.botInfo.id]
              if (typeof settings !== 'object') global.db.data.settings[ctx.botInfo.id] = {}
              if (settings) {
                if (!'backup' in settings) settings.backup = false
                if (!isNumber(settings.backupTime)) settings.backupTime = 0
                if (!'group' in settings) settings.group = false
                if (!'restrict' in settings) settings.restrict = false
                if (!'self' in settings) settings.self = false
                if (!isNumber(settings.unbannedwa)) settings.unbannedwa = 0
              } else global.db.data.settings[ctx.botInfo.id] = {
                antispam: true,
                backup: true,
                backup: false,
                backupTime: 0,
                group: false,
                restrict: false,
                self: false,
                unbannedwa: 0
              },
              global.db.write();
            } catch (e) {
                console.error(e)
            }
}

  const Owner = global.set.owner
  var isPrems = Owner || db.data.users[m.sender].premium
  export class PermissionChecker {
    constructor(userId) {
      this.userId = userId;
    }
    isOwner() {
        return this.userId === Owner;
    }
    premium() {
      return !isPrems
    }
}
