const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // منع إظهار QR في التيرمنال لأنه غير مفيد على Koyeb
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('✅ تم الاتصال بنجاح');

            const recipient = '201154480576@s.whatsapp.net'; // استبدل بالرقم المطلوب
            const message = 'أهلا، البوت يعمل على Koyeb 🚀';

            await sock.sendMessage(recipient, { text: message });
            console.log(`📩 تم إرسال الرسالة إلى ${recipient}`);
        } else if (connection === 'close') {
            console.log('❌ تم فصل الاتصال، إعادة المحاولة...');
            startBot();
        }
    });
}

startBot();
