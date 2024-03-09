export default {
    name: 'owner',
    cmd: ['owner'],
    tags: 'info',
    run: async ({ conn, m, text, prefix, command }) => {
        await conn.telegram.sendContact(m.chat, '6281319859673', 'Galang Purnama', m.send)
    }
};
