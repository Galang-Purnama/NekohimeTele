export default {
    name: 'delkeyboard',
    cmd: ['delkeyboard'],
    run: async ({ conn, m, prefix, command }) => {
        conn.deleteKeyboard(m.chat, 'Keyboard dihilangkan', m.repl)
    }
};