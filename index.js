const { create, Client } = require('@open-wa/wa-automate')
const welcome = require('./lib/welcome')
const msgHandler = require('./msgHndlr')
const options = require('./options')

const start = async (client = new Client()) => {
        console.log('[SERVER] IZUMI-BOT Started!')
        // Force it to keep the current session
        client.onStateChanged((state) => {
            console.log('[Client State]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
        client.onMessage((async (message) => {
            client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })
            msgHandler(client, message)
        }))

        client.onGlobalParicipantsChanged((async (heuh) => {
            await welcome(client, heuh)
            //left(client, heuh)
            }))
        
        client.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            if (totalMem < 30) { 
            	client.sendText(chat.id, `Anjay member nya cuma ${totalMem}, Kalo mau invite bot kedalam grup, minimal jumlah member ada 30`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
            } else {
                client.sendText(chat.groupMetadata.id, `IZUMI-BOT mendeteksi bahwa grup *${chat.contact.name}* adalah grup *ILLEGAL* karena telah memasukan bot kedalam grup yang tak dikenal\n\nGrup *${chat.contact.name}* akan direport oleh BOT sesaat lagi...\n\n untuk mengeluarkan bot dari grub *${chat.contact.name}* silahan ketik command !leave\n\nUntuk Invite BOT kedalam grup silahkan gunakan command *!join* untuk mendapatkan akses *LEGAL* silahkan gunakan key yang bisa didapat dengan mengechat owner di command *!owner*\nTerima Kasih`)
            }
        }))

        /*client.onAck((x => {
            const { from, to, ack } = x
            if (x !== 3) client.sendSeen(to)
        }))*/

        // listening on Incoming Call
        client.onIncomingCall(( async (call) => {
            await client.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan. nelfon = block!')
            .then(() => client.contactBlock(call.peerJid))
        }))
    }

create('BarBar', options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
