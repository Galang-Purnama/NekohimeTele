export default {
    cmd: ['t'],
    run: async ({ conn, m, prefix, text, command }) => {
        global.db.data.users[m.sender].mobil = 10
    },
};