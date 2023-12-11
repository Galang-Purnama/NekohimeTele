import { performance } from 'perf_hooks'
import { sizeFormatter } from 'human-readable'
import os, { cpus as _cpus, hostname, platform, version, release, arch, machine, totalmem, freemem } from 'node:os'
import axios from 'axios';
export default {
    name: 'ping',
    cmd: ['ping'],
    tags: 'info',
    run: async ({ conn, m, prefix, command }) => {
        let format = sizeFormatter({
            std: 'JEDEC', // 'SI' (default) | 'IEC' | 'JEDEC'
            decimalPlaces: 2,
            keepTrailingZeroes: false,
            render: (literal, symbol) => `${literal} ${symbol}B`,
          })
          const used = process.memoryUsage()
  const cpus = _cpus().map(cpu => {
    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
    return cpu
  })
  const cpu = cpus.reduce((last, cpu, _, { length }) => {
    last.total += cpu.total
    last.speed += cpu.speed / length
    last.times.user += cpu.times.user
    last.times.nice += cpu.times.nice
    last.times.sys += cpu.times.sys
    last.times.idle += cpu.times.idle
    last.times.irq += cpu.times.irq
    return last
  }, {
    speed: 0,
    total: 0,
    times: {
      user: 0,
      nice: 0,
      sys: 0,
      idle: 0,
      irq: 0
    }
  })
  let dat = await axios.get('https://ipwho.is')
  let json = await dat.data
  conn.sendButton(m.chat, `❏ RESPON-STATUS :
Merespon dalam ${performance.now()} millidetik

❏ SERVER-STATUS :
⬡ Flag : ${json.flag.emoji}
⬡ Hostname : ${os.hostname()}
⬡ Platfrom : ${os.platform()}
⬡ Arch : ${arch()} (${machine()})
⬡ Cpu Speed : ${format(cpu.speed)}
⬡ Country : ${json.country}
⬡ RAM: ${format(totalmem() - freemem())} / ${format(totalmem())}
⬡ FreeRam: ${format(freemem())}
⬡ Os : ${version()} / ${release()}

❏ NodeJS Memory Usage
${'' + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n') + ''}


${cpus[0] ? `❏ Total CPU Usage
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- ${(type + '').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

❏ CPU Core(s) Usage (${cpus.length} Core CPU)
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- ${(type + '').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}`, [[set.menuBtn, '/menu']], m.repl)
    },
};