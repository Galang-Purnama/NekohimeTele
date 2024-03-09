export default {
    name: 'info',
    cmd: ['info'],
    tags: 'info',
    run: async ({ conn, m, prefix, command }) => {
        conn.keyboard(m.chat, `Info Bot ${conn.botInfo.username}

- Bot Name : ${conn.botInfo.username}
- First Name : ${conn.botInfo.first_name}
- Apakah Bot boleh di add ke group? ${conn.botInfo.can_join_groups ? 'Diperbolehkan' : 'Tidak diperbolehkan'}
- Apakah bot read chat group? ${conn.botInfo.can_read_all_group_messages ? 'Iya' : 'Tidak'}

About Bot :
- Bot ini dibuat oleh @GalangP_Dev dengan menggunakan bahasa pemrograman Java Script dan menggunakan library Telegraf 
- Bot ini disuport oleh @BotFather
- Bot ini saya buat untuk mempermudah teman-teman untuk melakukan suatu hal, selain itu bot ini saya buat karena saya gabut dan juga untuk menambah postfolio saya😁

Note :
Jika ada bug silahkan report ke owner @GalangP_Dev

Semoga Bermanfaat ya🤗`, [[set.pingBtn, '/ping'], [set.menuBtn, '/menu'], ['Hapus Keyboard', '/delkeyboard']], m.send)
    }
};