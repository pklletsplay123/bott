/*
* "Wahai orang-orang yang beriman, mengapakah kamu mengatakan sesuatu yang tidak kamu kerjakan?
* Amat besar kebencian di sisi Allah bahwa kamu mengatakan apa-apa yang tidak kamu kerjakan."
* (QS ash-Shaff: 2-3).
*/
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const moment = require('moment-timezone')
const get = require('got')
const fetch = require('node-fetch')
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const { liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv, ss } = require('./lib/functions')
const { help, snk, info, donate, readme, listChannel } = require('./lib/help')
const { stdout } = require('process')
const nsfw_ = JSON.parse(fs.readFileSync('./lib/NSFW.json'))
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'))
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')
const biodata_ = JSON.parse(fs.readFileSync('./lib/biodata.json'))
const registered_ = JSON.parse(fs.readFileSync('./lib/register.json'))
const banned = JSON.parse(fs.readFileSync('./lib/banned.json'))

moment.tz.setDefault('Asia/Jakarta').locale('id')

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const q = args.join(' ')
        const isRegistered = registered_.includes(sender.id)
        const isBanned = banned.includes(sender.id)

        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const mess = {
            wait: '[ WAIT ] Sedang di proses⏳ silahkan tunggu sebentar ya bro 🍻',
            error: {
                St: '[❗] Kirim gambar dengan caption *!sticker* atau tag gambar yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan njir, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan njir, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan njir, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan njir, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan admin group!',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!'
            }
        }
        const apiKey = 'UqapQCVGfHDuvXwfpQas'
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = ["6287833474586@c.us"]
        const isOwner = ownerNumber.includes(sender.id)
        const isBlocked = blockNumber.includes(sender.id)
        const isNsfw = isGroupMsg ? nsfw_.includes(chat.id) : false
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        //if (!isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname))
        //if (isGroupMsg && !command.startsWith('!')) console.log('\x1b[1;33m~\x1b[1;37m>', '[\x1b[1;31mMSG\x1b[1;37m]', time, color(body), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return
        //if (!isOwner) return
        if (isBanned) {
            return console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        switch(command) {

        case '!register':
                if (isRegistered) return await client.reply(from, 'Kamu sebelumnya sudah mendaftar.', id)
                const dataDiri = q.split('|').join('-')
                if (!dataDiri) return await client.reply(from, 'Masukkan data diri!', id)
                registered_.push(sender.id)
                biodata_.push(dataDiri)
                fs.writeFileSync('./lib/register.json', JSON.stringify(registered_))
                fs.writeFileSync('./lib/biodata.json', JSON.stringify(biodata_))
                await client.reply(from, 'Kamu telah terdaftar!', id)
            break

        case '!sticker':
        case '!stiker':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (isMedia && type === 'image') {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length === 2) {
                const url = args[1]
                if (url.match(isUrl)) {
                    await client.sendStickerfromUrl(from, url, { method: 'get' })
                        .catch(err => console.log('Caught exception: ', err))
                } else {
                    client.reply(from, mess.error.Iv, id)
                }
            } else {
                    client.reply(from, mess.error.St, id)
            }
            break
        case '!stickergiff':
        case '!stikergiff':
        case '!sgiff':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database IZUMI-BOT!\n Silakan daftar dengan format:\n*!register* <nama | daerah> \ncontoh:\n*!register* Yuuru | Trenggalek', id)
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, '🍻 [BENTAR] Sedang di proses⏳ silahkan tunggu ± 1 min!', id)
                    const filename = `./media/aswu.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                    })
                } else (
                    client.reply(from, '[❗] Kirim video dengan caption *!stickerGif* max 10 sec!', id)
                )
            }
            break
        case '!stickernobg':
        case '!stikernobg':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (isMedia) {
                try {
                    var mediaData = await decryptMedia(message, uaOverride)
                    var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    var base64img = imageBase64
                    var outFile = './media/img/noBg.png'
                    //untuk api key kalian bisa dapatkan pada website remove.bg
                    var result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'F7Pn3D3jW8fqvchzMkhHkyUV', size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
                } catch(err) {
                    console.log(err)
                }
            }
            break
        case '!donasi':
        case '!donate':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            client.sendLinkWithAutoPreview(from, 'Donasi seiklasnya di https://saweria.co/dhanifitrah5', donate)
            break
        case '!tts':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!tts [id, en, jp, ar] [teks]*, contoh *!tts id pagi lord*')
            const ttsId = require('node-gtts')('id')
            const ttsEn = require('node-gtts')('en')
            const ttsJp = require('node-gtts')('ja')
            const ttsAr = require('node-gtts')('ar')
            const dataText = body.slice(8)
            if (dataText === '') return client.reply(from, 'Baka?', id)
            if (dataText.length > 500) return client.reply(from, 'Teks terlalu panjang njir!', id)
            var dataBhs = body.slice(5, 7)
            if (dataBhs == 'id') {
                ttsId.save('./media/tts/resId.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resId.mp3', id)
                })
            } else if (dataBhs == 'en') {
                ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resEn.mp3', id)
                })
            } else if (dataBhs == 'jp') {
                ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resJp.mp3', id)
                })
            } else if (dataBhs == 'ar') {
                ttsAr.save('./media/tts/resAr.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts/resAr.mp3', id)
                })
            } else {
                client.reply(from, 'Masukkan data bahasa : [id] untuk indonesia, [en] untuk inggris, [jp] untuk jepang, dan [ar] untuk arab', id)
            }
            break
        case '!nulis':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!nulis [teks]*', id)
            const nulis = encodeURIComponent(body.slice(7))
            client.reply(from, mess.wait, id)
            let urlnulis = `https://bangandre.herokuapp.com/nulis?teks=${nulis}`
            await fetch(urlnulis, {method: "GET"})
            .then(res => res.json())
            .then(async (json) => {
                await client.sendFileFromUrl(from, json.result, 'Nulis.jpg', 'Nih anjim', id)
            }).catch(e => client.reply(from, "Error: "+ e));
            break
        case '!ytmp3':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!ytmp3 [linkYt]*, untuk contoh silahkan kirim perintah *!readme*')
            let isLinks = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLinks) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const resp = await get.get(`https://mhankbarbar.herokuapp.com/api/yta?url=${args[1]}&apiKey=${apiKey}`).json()
                if (resp.error) {
                    client.reply(from, resp.error, id)
                } else {
                    const { title, thumb, filesize, result } = await resp
                    if (Number(filesize.split(' MB')[0]) >= 30.00) return client.reply(from, 'Maaf durasi video sudah melebihi batas maksimal!', id)
                    client.sendFileFromUrl(from, thumb, 'thumb.jpg', `➸ *Title* : ${title}\n➸ *Filesize* : ${filesize}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                    await client.sendFileFromUrl(from, result, `${title}.mp3`, '', id).catch(() => client.reply(from, mess.error.Yt3, id))
                    //await client.sendAudio(from, result, id)
                }
            } catch (err) {
                client.sendText(ownerNumber[0], 'Error ytmp3 : '+ err)
                client.reply(from, mess.error.Yt3, id)
            }
            break
        case '!ytmp4':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!ytmp4 [linkYt]*, untuk contoh silahkan kirim perintah *!readme*')
            let isLin = args[1].match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
            if (!isLin) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const ytv = await get.get(`https://mhankbarbar.herokuapp.com/api/ytv?url=${args[1]}&apiKey=${apiKey}`).json()
                if (ytv.error) {
                    client.reply(from, ytv.error, id)
                } else {
                    if (Number(ytv.filesize.split(' MB')[0]) > 40.00) return client.reply(from, 'Maaf durasi video sudah melebihi batas maksimal!', id)
                    client.sendFileFromUrl(from, ytv.thumb, 'thumb.jpg', `➸ *Title* : ${ytv.title}\n➸ *Filesize* : ${ytv.filesize}\n\nSilahkan tunggu sebentar proses pengiriman file membutuhkan waktu beberapa menit.`, id)
                    await client.sendFileFromUrl(from, ytv.result, `${ytv.title}.mp4`, '', id).catch(() => client.reply(from, mess.error.Yt4, id))
                }
            } catch (er) {
                client.sendText(ownerNumber[0], 'Error ytmp4 : '+ er)
                client.reply(from, mess.error.Yt4, id)
            }
            break
        case '!wiki':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!wiki [query]*\nContoh : *!wiki gay*', id)
            const query_ = body.slice(6)
            const wiki = await get.get(`https://arugaz.herokuapp.com/api/wiki?q=${query_}`).json()
            if (wiki.error) {
                client.reply(from, wiki.error, id)
            } else {
                client.reply(from, `➸ *Yang anda cari* : ${query_}\n\n➸ *Hasilnya* : ${wiki.result.split('\nby: ArugaZ').join("")}`, id)
            }
            break
        case '!cuaca':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!cuaca [tempat]*\nContoh : *!cuaca Trenggalek', id)
            const tempat = body.slice(7)
            const weather = await get.get(`https://alfians-api.herokuapp.com/api/cuaca?q=${tempat}`).json()
            if (weather.error) {
                client.reply(from, weather.error, id)
            } else {
                client.reply(from, `⚜ Tempat : ${weather.result.tempat}\n\n⚜ Angin : ${weather.result.angin}\n⚜ Cuaca : ${weather.result.cuaca}\n⚜ Deskripsi : ${weather.result.desk}\n⚜ Kelembapan : ${weather.result.kelembapan}\n⚜ Suhu : ${weather.result.suhu}\n⚜ Udara : ${weather.result.udara}`, id)
            }
            break
        case '!fb':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!fb [linkFb]* untuk contoh silahkan kirim perintah *!readme*', id)
            if (!args[1].includes('facebook.com')) return client.reply(from, mess.error.Iv, id)
            client.reply(from, mess.wait, id)
            const epbe = await get.get(`https://mhankbarbar.herokuapp.com/api/epbe?url=${args[1]}&apiKey=${apiKey}`).json()
            if (epbe.error) return client.reply(from, epbe.error, id)
            client.sendFileFromUrl(from, epbe.result.sdQuality, 'epbe.mp4', epbe.title, id)
            break
        case '!creator':
        case '!owner':
            client.sendContact(from, '6287833474586@c.us')
            break
        case '!ig':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!ig [linkIg]* untuk contoh silahkan kirim perintah *!readme*')
            if (!args[1].match(isUrl) && !args[1].includes('instagram.com')) return client.reply(from, mess.error.Iv, id)
            try {
                client.reply(from, mess.wait, id)
                const resp = await get.get(`https://alfians-api.herokuapp.com/api/ig?url=${args[1]}`).json()
                if (resp.result.includes('.mp4')) {
                    var ext = '.mp4'
                } else {
                    var ext = '.jpg'
                }
                await client.sendFileFromUrl(from, resp.result, `igeh${ext}`, '', id)
            } catch {
                client.reply(from, mess.error.Ig, id)
                }
            break
        case '!nsfw':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                nsfw_.push(chat.id)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, 'NSWF Command berhasil di aktifkan di group ini!\nIngat dosa ditanggung sendiri\nKirim perintah *!nsfwMenu* untuk melihat menu maksiat yang tersedia', id)
            } else if (args[1].toLowerCase() === 'disable') {
                nsfw_.splice(chat.id, 1)
                fs.writeFileSync('./lib/NSFW.json', JSON.stringify(nsfw_))
                client.reply(from, 'NSFW Command berhasil di nonaktifkan di group ini!\nSelamat anda telah terhindar dari siksa api neraka🙏🏼', id)
            } else {
                client.reply(from, 'Pilih enable atau disable setan! 👿', id)
            }
            break
        case '!welcome':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Admin group!', id)
            if (args.length === 1) return client.reply(from, 'Pilih enable atau disable!', id)
            if (args[1].toLowerCase() === 'enable') {
                welkom.push(chat.id)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di aktifkan di group ini!', id)
            } else if (args[1].toLowerCase() === 'disable') {
                welkom.splice(chat.id, 1)
                fs.writeFileSync('./lib/welcome.json', JSON.stringify(welkom))
                client.reply(from, 'Fitur welcome berhasil di nonaktifkan di group ini!', id)
            } else {
                client.reply(from, 'Pilih enable atau disable anjay!', id)
            }
            break
        case '!nsfwmenu':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isNsfw) return
            client.reply(from, '1. !cersex\n2. !vidsex', id)
            break
        case '!igstalk':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1)  return client.reply(from, 'Kirim perintah *!igStalk @username*\nConntoh *!igStalk @mia_khalifa*', id)
            const stalk = await get.get(`https://arugaz.herokuapp.com/api/stalk?username=${args[1]}`).json()
            if (stalk.error) return client.reply(from, stalk.error, id)
            const { Biodata, Jumlah_Followers, Jumlah_Following, Jumlah_Post, Name, Username, Profile_pic } = stalk
            const caps = `⚜ *Nama* : ${Name}\n⚜ *Username* : ${Username}\n⚜ *Jumlah Followers* : ${Jumlah_Followers}\n⚜ *Jumlah Following* : ${Jumlah_Following}\n⚜ *Jumlah Postingan* : ${Jumlah_Post}\n⚜ *Biodata* : ${Biodata.split('-\nby: ArugaZ').join("")}`
            await client.sendFileFromUrl(from, Profile_pic, 'Profile.jpg', caps, id)
            break
        case '!infogempa':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const bmkg = await get.get(`https://arugaz.herokuapp.com/api/infogempa`).json()
            const { potensi, koordinat, lokasi, kedalaman, magnitude, waktu, map } = bmkg
            const hasil = `*${waktu}*\n📍 *Lokasi* : *${lokasi}*\n〽️ *Kedalaman* : *${kedalaman}*\n💢 *Magnitude* : *${magnitude}*\n🔘 *Potensi* : *${potensi}*\n📍 *Koordinat* : *${koordinat}*`
            client.sendFileFromUrl(from, map, 'shakemap.jpg', hasil, id)
            break
        //case '!anime':
            //if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            //if (args.length === 1) return client.reply(from, 'Kirim perintah *!anime [Judul Anime]*\nContoh : *!anime Boku No Pico*', id)
            //const animek = await get.get(`https://arugaz.herokuapp.com/api/dewabatch?q=${body.slice(7)}`).json()
            //if (animek.error) return client.reply(from, animek.error, id)
            //const res_animek = `${animek.result}\n\n${animek.sinopsis}\n\n`
            //client.sendFileFromUrl(from, animek.thumb, 'dewabatch.jpg', res_animek, id)
            //break
        case '!anime':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!anime [Judul Anime]*\nContoh : *!anime Boku No Pico*', id)
            const animek = await get.get(`https://alfians-api.herokuapp.com/api/kuso?q=${body.slice(7)}`).json()
            if (animek.error) return client.reply(from, animek.error, id)
            const res_animek = `*${animek.title}*\n\n${animek.info}\n\nSinopsis: ${animek.sinopsis}\nLink Download:\n${animek.link_dl}`
            client.sendFileFromUrl(from, animek.thumb, 'dewabatch.jpg', res_animek, id)
            break
        case '!nh':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            //if (!isOwner) return
            //if (isGroupMsg) return client.reply(from, 'Sorry this command for private chat only!', id)
            if (args.length === 2) {
                const nuklir = body.split(' ')[1]
                client.reply(from, mess.wait, id)
                const cek = await nhentai.exists(nuklir)
                if (cek === true)  {
                    try {
                        const api = new API()
                        const pic = await api.getBook(nuklir).then(book => {
                            return api.getImageURL(book.cover)
                        })
                        const dojin = await nhentai.getDoujin(nuklir)
                        const { title, details, link } = dojin
                        const { parodies, tags, artists, groups, languages, categories } = await details
                        var teks = `*⚜Title* : ${title}\n\n*⚜Parodies* : ${parodies}\n\n*⚜Tags* : ${tags.join(', ')}\n\n*⚜Artists* : ${artists.join(', ')}\n\n*⚜Groups* : ${groups.join(', ')}\n\n*⚜Languages* : ${languages.join(', ')}\n\n*⚜Categories* : ${categories}\n\n*⚜Link* : ${link}`
                        //exec('nhentai --id=' + nuklir + ` -P mantap.pdf -o ./hentong/${nuklir}.pdf --format `+ `${nuklir}.pdf`, (error, stdout, stderr) => {
                        client.sendFileFromUrl(from, pic, 'hentod.jpg', teks, id)
                            //client.sendFile(from, `./hentong/${nuklir}.pdf/${nuklir}.pdf.pdf`, then(() => `${title}.pdf`, '', id)).catch(() => 
                            //client.sendFile(from, `./hentong/${nuklir}.pdf/${nuklir}.pdf.pdf`, `${title}.pdf`, '', id))
                            /*if (error) {
                                console.log('error : '+ error.message)
                                return
                            }
                            if (stderr) {
                                console.log('stderr : '+ stderr)
                                return
                            }
                            console.log('stdout : '+ stdout)*/
                            //})
                    } catch (err) {
                        client.reply(from, '[❗] Terjadi kesalahan, mungkin kode nuklir salah', id)
                    }
                } else {
                    client.reply(from, '[❗] Kode nuClear Salah!')
                }
            } else {
                client.reply(from, '[ WRONG ] Kirim perintah *!nh [kode nuklir]* untuk contoh kirim perintah *!readme*')
            }
            break
        case '!brainly':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length >= 2){
                const BrainlySearch = require('./lib/brainly')
                let tanya = body.slice(9)
                let jum = Number(tanya.split('.')[1]) || 2
                if (jum > 10) return client.reply(from, 'Max 10!', id)
                if (Number(tanya[tanya.length-1])){
                    tanya
                }
                client.reply(from, `⚜ *Pertanyaan* : ${tanya.split('.')[0]}\n\n⚜ *Jumlah jawaban* : ${Number(jum)}`, id)
                await BrainlySearch(tanya.split('.')[0],Number(jum), function(res){
                    res.forEach(x=>{
                        if (x.jawaban.fotoJawaban.length == 0) {
                            client.reply(from, `⚜ *Pertanyaan* : ${x.pertanyaan}\n\n⚜ *Jawaban* : ${x.jawaban.judulJawaban}\n`, id)
                        } else {
                            client.reply(from, `⚜ *Pertanyaan* : ${x.pertanyaan}\n\n⚜ *Jawaban* : ${x.jawaban.judulJawaban}\n\n⚜ *Link foto jawaban* : ${x.jawaban.fotoJawaban.join('\n')}`, id)
                        }
                    })
                })
            } else {
                client.reply(from, 'Cara pake :\n!brainly [pertanyaan] [.jumlah]\n\nEx : \n!brainly Fungsi DPR .2', id)
            }
            break
        case '!wait':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Searching....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                    if (resolt.docs && resolt.docs.length <= 0) {
                        client.reply(from, 'Maaf, saya tidak tau ini anime apaan', id)
                    }
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                        teks = '*Saya memiliki keyakinan rendah dalam hal ini,mungkin yang ente maksud anime ini:* :\n\n'
                    }
                    teks += `⚜ *Title Japanese* : ${title}\n⚜ *Title chinese* : ${title_chinese}\n⚜ *Title Romaji* : ${title_romaji}\n⚜ *Title English* : ${title_english}\n`
                    teks += `⚜ *Ecchi* : ${is_adult}\n`
                    teks += `⚜ *Eps* : ${episode.toString()}\n`
                    teks += `⚜ *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Error !', id)
                })
            } else {
                client.sendFile(from, './media/img/tutod.jpg', 'Tutor.jpg', 'Nih contohnya gini mhank!', id)
            }
            break
        case '!quotemaker':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            arg = body.trim().split('|')
            if (arg.length >= 4) {
                client.reply(from, mess.wait, id)
                const quotes = encodeURIComponent(arg[1])
                const author = encodeURIComponent(arg[2])
                const theme = encodeURIComponent(arg[3])
                await quotemaker(quotes, author, theme).then(amsu => {
                    client.sendFile(from, amsu, 'quotesmaker.jpg','neh...').catch(() => {
                       client.reply(from, mess.error.Qm, id)
                    })
                })
            } else {
                client.reply(from, 'Cara bikin Quotes nya kek gini: \n!quotemaker |teks|watermark|theme\n\nEx :\n!quotemaker |pagi lord|izumi bot|random', id)
            }
            break
        case '!linkgroup':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin anjay', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
            } else {
                client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group anjay!', id)
            }
            break
        case '!bc':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot anjay!', id)
            let msg = body.slice(4)
            const chatz = await client.getAllChatIds()
            for (let ids of chatz) {
                var cvk = await client.getChatById(ids)
                if (!cvk.isReadOnly) await client.sendText(ids, `[ IZUMI-BOT Broadcast ]\n\n${msg}`)
            }
            client.reply(from, 'Broadcast Success!', id)
            break
        case '!adminlist':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group anjay!', id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break
        case '!ownergroup':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group  anjay!', id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `Owner Group : @${Owner_}`)
            break
        case '!mentionall':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group anjay!', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group anjay', id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘 Summon Member 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += 'Yang jadi sider siap siap di kick sama admin group ya wkwkwkwkwk'
            await client.sendTextWithMentions(from, hehe)
            break
        case '!kickall':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group anjay!', id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh Owner group anjay', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin bro', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
                    console.log('Upss ini kan Admin group')
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
            client.reply(from, 'Success kick all member', id)
            break
        case '!leaveall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot bro', id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `Maaf bot sedang pembersihan, total chat aktif : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, 'Succes leave all group!', id)
            break
        case '!clearall':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot ya mhank', id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, 'Succes clear all chat!', id)
            break
        case '!add':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const orang = args[1]
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group anjay', id)
            if (args.length === 1) return client.reply(from, 'Untuk menggunakan fitur ini, kirim command *!add* 628xxxxx', id)
            if (!isGroupAdmins) return client.reply(from, 'Command ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Command ini hanya bisa di gunakan ketika bot menjadi admin', id)
            try {
                await client.addParticipant(from,`${orang}@c.us`)
            } catch {
                client.reply(from, mess.error.Ad, id)
            }
            break
        case '!kick':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan Perintah ini, kirim perintah *!kick* @tagmember', id)
            await client.sendText(from, `Perintah diterima, mengeluarkan:\n${mentionedJidList.join('\n')}`)
            for (let i = 0; i < mentionedJidList.length; i++) {
                if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, mess.error.Ki, id)
                await client.removeParticipant(groupId, mentionedJidList[i])
            }
            break
        case '!leave':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Perintah ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Perintah ini hanya bisa di gunakan oleh admin group', id)
            await client.sendText(from,'Sayonara Minna san').then(() => client.leaveGroup(groupId))
            break
        case '!promote':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!promote* @tagmember', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 user.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut sudah menjadi admin.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menambahkan @${mentionedJidList[0]} sebagai admin.`)
            break
        case '!demote':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan ketika bot menjadi admin', id)
            if (mentionedJidList.length === 0) return client.reply(from, 'Untuk menggunakan fitur ini, kirim perintah *!demote* @tagadmin', id)
            if (mentionedJidList.length >= 2) return client.reply(from, 'Maaf, perintah ini hanya dapat digunakan kepada 1 orang.', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, 'Maaf, user tersebut tidak menjadi admin.', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Perintah diterima, menghapus jabatan @${mentionedJidList[0]}.`)
            break
        case '!join':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            //return client.reply(from, 'Jika ingin meng-invite bot ke group anda, silahkan izin ke wa.me/6285892766102', id)
            if (args.length < 2) return client.reply(from, 'Kirim command *!join linkgroup key*\n\nContoh:\n!join https://chat.whatsapp.com/EnalEgnJt5qH9LGncdZyx4\nuntuk verifikasi group kamu bisa meminta key yang valid ke owner bot', id)
            const link = args[1]
            const key = args[2]
            const tGr = await client.getAllGroups()
            const minMem = 30
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            if (key !== '27112002') return client.reply(from, '*key* salah! silahkan chat owner bot dengan mengetik *!owner* unruk mendapatkan key yang valid', id)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, 'Ini link?\nAnda cari ribut? 👊🤬', id)
            if (tGr.length > 50) return client.reply(from, 'Maaf jumlah group sudah maksimal😅!\nchat owner bot di *!owner* untuk memasukkan bot kedalam Group', id)
            if (check.size < minMem) return client.reply(from, 'Cih member group cuman dikit gak usah undang BOT, Minimal member harus 30 orang atau lebih', id)
            if (check.status === 200) {
                await client.joinGroupViaLink(link).then(() => client.reply(from, 'Bot akan segera masuk ke grup anda sebentar lagi!🍻'))
            } else {
                client.reply(from, 'Link group yang anda masukkan tidak valid anjay!', id)
            }
            break
        case '!delete':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (!isGroupMsg) return client.reply(from, 'Fitur ini hanya bisa di gunakan dalam group', id)
            if (!isGroupAdmins) return client.reply(from, 'Fitur ini hanya bisa di gunakan oleh admin group', id)
            if (!quotedMsg) return client.reply(from, 'Salah woy!!, kirim perintah *!delete [tagpesanbot]*', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Salah woy!!, Bot tidak bisa menghapus chat user lain!', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break
        case '!getses':
            if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot anjay!', id)
            const sesPic = await client.getSnapshot()
            client.sendFile(from, sesPic, 'session.png', 'Neh...', id)
            break
        case '!lirik':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length == 1) return client.reply(from, 'Kirim perintah *!lirik [optional]*, contoh *!apa lo tega*', id)
            const lagu = body.slice(7)
            const lirik = await liriklagu(lagu)
            client.reply(from, lirik, id)
            break
        case '!chord':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!chord [query]*, contoh *!chord aku bukan boneka*', id)
            const query__ = body.slice(7)
            const chord = await get.get(`https://arugaz.herokuapp.com/api/chord?q=${query__}`).json()
            if (chord.error) return client.reply(from, chord.error, id)
            client.reply(from, chord.result, id)
            break
        case '!listdaerah':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const listDaerah = await get('https://mhankbarbar.herokuapp.com/daerah').json()
            client.reply(from, listDaerah.result, id)
            break
        case '!listblock':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            let hih = `Berikut adalah daftar para kriminal yang telah di banned karena melanggar Syarat & Ketentuan yang berlaku \nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                hih += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            client.sendTextWithMentions(from, hih, id)
            break
        case '!jadwalshalat':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, '[❗] Kirim perintah *!jadwalShalat [daerah]*\ncontoh : *!jadwalShalat Trenggalek*\nUntuk list daerah kirim perintah *!listDaerah*')
            const daerah = body.slice(14)
            const jadwalShalat = await get.get(`https://arugaz.herokuapp.com/api/jadwalshalat?daerah=${daerah}`).json()
            if (jadwalShalat.error) return client.reply(from, jadwalShalat.error, id)
            const { Imsyak, Subuh, Dhuha, Dzuhur, Ashar, Maghrib, Isya } = await jadwalShalat
            arrbulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            tgl = new Date().getDate()
            bln = new Date().getMonth()
            thn = new Date().getFullYear()
            const resultJadwal = `Jadwal shalat di ${daerah}, ${tgl}-${arrbulan[bln]}-${thn}\n\n⚜Imsyak : ${Imsyak}\n⚜Subuh : ${Subuh}\n⚜Dhuha : ${Dhuha}\n⚜Dzuhur : ${Dzuhur}\n⚜Ashar : ${Ashar}\n⚜Maghrib : ${Maghrib}\n⚜Isya : ${Isya}`
            client.reply(from, resultJadwal, id)
            break
        case '!listchannel':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            client.reply(from, listChannel, id)
            break
        case '!jadwaltv':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Ketik Command *!jadwalTv [channel]*', id)
            const query = body.slice(10).toLowerCase()
            const jadwal = await jadwalTv(query)
            client.reply(from, jadwal, id)
            break
        case '!jadwaltvnow':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const jadwalNow = await get.get('https://api.haipbis.xyz/jadwaltvnow').json()
            client.reply(from, `Jam : ${jadwalNow.jam}\n\nJadwalTV : ${jadwalNow.jadwalTV}`, id)
            break
        case '!loli':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const loli = await get.get('https://mhankbarbar.herokuapp.com/api/randomloli').json()
            client.sendFileFromUrl(from, loli.result, 'loli.jpeg', 'nih lolinya om\nDasar lolicon', id)
            break
        case '!waifur':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const waifu = await get.get(`https://mhankbarbar.herokuapp.com/api/waifu?apiKey=${apiKey}`).json()
            client.sendFileFromUrl(from, waifu.image, 'Waifu.jpg', `➸ Name : ${waifu.name}\n➸ Description : ${waifu.desc}\n\n➸ Source : ${waifu.source}`, id)
            break
        case '!husbur':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const diti = fs.readFileSync('./lib/husbu.json')
            const ditiJsin = JSON.parse(diti)
            const rindIndix = Math.floor(Math.random() * ditiJsin.length)
            const rindKiy = ditiJsin[rindIndix]
            client.sendFileFromUrl(from, rindKiy.image, 'Husbu.jpg', rindKiy.teks, id)
            break
        case '!randomhentair':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (isGroupMsg) {
                if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id)
                const hentai = await randomNimek('hentai')
                if (hentai.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, hentai, `Hentai${ext}`, 'Hentai!', id)
                break
            } else {
                const hentai = await randomNimek('hentai')
                if (hentai.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, hentai, `Hentai${ext}`, 'Hentai!', id)
            }
        case '!randomnsfwnekor':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (isGroupMsg) {
                if (!isNsfw) return client.reply(from, 'Command/Perintah NSFW belum di aktifkan di group ini!', id)
                const nsfwneko = await randomNimek('nsfw')
                if (nsfwneko.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, nsfwneko, `nsfwNeko${ext}`, 'Nsfwneko!', id)
            } else {
                const nsfwneko = await randomNimek('nsfw')
                if (nsfwneko.endsWith('.png')) {
                    var ext = '.png'
                } else {
                    var ext = '.jpg'
                }
                client.sendFileFromUrl(from, nsfwneko, `nsfwNeko${ext}`, 'Nsfwneko!', id)
            }
            break
        case '!randomnekonime':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const nekonime = await get.get('https://mhankbarbar.herokuapp.com/api/nekonime').json()
            if (nekonime.result.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nekonime.result, `Nekonime${ext}`, 'Nekonime!', id)
            break
        case '!randomtrapnimer':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const trap = await randomNimek('trap')
            if (trap.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, trap, `trapnime${ext}`, 'Trapnime!', id)
            break
        case '!randomanimer':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const nime = await randomNimek('anime')
            if (nime.endsWith('.png')) {
                var ext = '.png'
            } else {
                var ext = '.jpg'
            }
            client.sendFileFromUrl(from, nime, `Randomanime${ext}`, 'Randomanime!', id)
            break
        case '!inu':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const list = ["https://cdn.shibe.online/shibes/247d0ac978c9de9d9b66d72dbdc65f2dac64781d.jpg","https://cdn.shibe.online/shibes/1cf322acb7d74308995b04ea5eae7b520e0eae76.jpg","https://cdn.shibe.online/shibes/1ce955c3e49ae437dab68c09cf45297d68773adf.jpg","https://cdn.shibe.online/shibes/ec02bee661a797518d37098ab9ad0c02da0b05c3.jpg","https://cdn.shibe.online/shibes/1e6102253b51fbc116b887e3d3cde7b5c5083542.jpg","https://cdn.shibe.online/shibes/f0c07a7205d95577861eee382b4c8899ac620351.jpg","https://cdn.shibe.online/shibes/3eaf3b7427e2d375f09fc883f94fa8a6d4178a0a.jpg","https://cdn.shibe.online/shibes/c8b9fcfde23aee8d179c4c6f34d34fa41dfaffbf.jpg","https://cdn.shibe.online/shibes/55f298bc16017ed0aeae952031f0972b31c959cb.jpg","https://cdn.shibe.online/shibes/2d5dfe2b0170d5de6c8bc8a24b8ad72449fbf6f6.jpg","https://cdn.shibe.online/shibes/e9437de45e7cddd7d6c13299255e06f0f1d40918.jpg","https://cdn.shibe.online/shibes/6c32141a0d5d089971d99e51fd74207ff10751e7.jpg","https://cdn.shibe.online/shibes/028056c9f23ff40bc749a95cc7da7a4bb734e908.jpg","https://cdn.shibe.online/shibes/4fb0c8b74dbc7653e75ec1da597f0e7ac95fe788.jpg","https://cdn.shibe.online/shibes/125563d2ab4e520aaf27214483e765db9147dcb3.jpg","https://cdn.shibe.online/shibes/ea5258fad62cebe1fedcd8ec95776d6a9447698c.jpg","https://cdn.shibe.online/shibes/5ef2c83c2917e2f944910cb4a9a9b441d135f875.jpg","https://cdn.shibe.online/shibes/6d124364f02944300ae4f927b181733390edf64e.jpg","https://cdn.shibe.online/shibes/92213f0c406787acd4be252edb5e27c7e4f7a430.jpg","https://cdn.shibe.online/shibes/40fda0fd3d329be0d92dd7e436faa80db13c5017.jpg","https://cdn.shibe.online/shibes/e5c085fc427528fee7d4c3935ff4cd79af834a82.jpg","https://cdn.shibe.online/shibes/f83fa32c0da893163321b5cccab024172ddbade1.jpg","https://cdn.shibe.online/shibes/4aa2459b7f411919bf8df1991fa114e47b802957.jpg","https://cdn.shibe.online/shibes/2ef54e174f13e6aa21bb8be3c7aec2fdac6a442f.jpg","https://cdn.shibe.online/shibes/fa97547e670f23440608f333f8ec382a75ba5d94.jpg","https://cdn.shibe.online/shibes/fb1b7150ed8eb4ffa3b0e61ba47546dd6ee7d0dc.jpg","https://cdn.shibe.online/shibes/abf9fb41d914140a75d8bf8e05e4049e0a966c68.jpg","https://cdn.shibe.online/shibes/f63e3abe54c71cc0d0c567ebe8bce198589ae145.jpg","https://cdn.shibe.online/shibes/4c27b7b2395a5d051b00691cc4195ef286abf9e1.jpg","https://cdn.shibe.online/shibes/00df02e302eac0676bb03f41f4adf2b32418bac8.jpg","https://cdn.shibe.online/shibes/4deaac9baec39e8a93889a84257338ebb89eca50.jpg","https://cdn.shibe.online/shibes/199f8513d34901b0b20a33758e6ee2d768634ebb.jpg","https://cdn.shibe.online/shibes/f3efbf7a77e5797a72997869e8e2eaa9efcdceb5.jpg","https://cdn.shibe.online/shibes/39a20ccc9cdc17ea27f08643b019734453016e68.jpg","https://cdn.shibe.online/shibes/e67dea458b62cf3daa4b1e2b53a25405760af478.jpg","https://cdn.shibe.online/shibes/0a892f6554c18c8bcdab4ef7adec1387c76c6812.jpg","https://cdn.shibe.online/shibes/1b479987674c9b503f32e96e3a6aeca350a07ade.jpg","https://cdn.shibe.online/shibes/0c80fc00d82e09d593669d7cce9e273024ba7db9.jpg","https://cdn.shibe.online/shibes/bbc066183e87457b3143f71121fc9eebc40bf054.jpg","https://cdn.shibe.online/shibes/0932bf77f115057c7308ef70c3de1de7f8e7c646.jpg","https://cdn.shibe.online/shibes/9c87e6bb0f3dc938ce4c453eee176f24636440e0.jpg","https://cdn.shibe.online/shibes/0af1bcb0b13edf5e9b773e34e54dfceec8fa5849.jpg","https://cdn.shibe.online/shibes/32cf3f6eac4673d2e00f7360753c3f48ed53c650.jpg","https://cdn.shibe.online/shibes/af94d8eeb0f06a0fa06f090f404e3bbe86967949.jpg","https://cdn.shibe.online/shibes/4b55e826553b173c04c6f17aca8b0d2042d309fb.jpg","https://cdn.shibe.online/shibes/a0e53593393b6c724956f9abe0abb112f7506b7b.jpg","https://cdn.shibe.online/shibes/7eba25846f69b01ec04de1cae9fed4b45c203e87.jpg","https://cdn.shibe.online/shibes/fec6620d74bcb17b210e2cedca72547a332030d0.jpg","https://cdn.shibe.online/shibes/26cf6be03456a2609963d8fcf52cc3746fcb222c.jpg","https://cdn.shibe.online/shibes/c41b5da03ad74b08b7919afc6caf2dd345b3e591.jpg","https://cdn.shibe.online/shibes/7a9997f817ccdabac11d1f51fac563242658d654.jpg","https://cdn.shibe.online/shibes/7221241bad7da783c3c4d84cfedbeb21b9e4deea.jpg","https://cdn.shibe.online/shibes/283829584e6425421059c57d001c91b9dc86f33b.jpg","https://cdn.shibe.online/shibes/5145c9d3c3603c9e626585cce8cffdfcac081b31.jpg","https://cdn.shibe.online/shibes/b359c891e39994af83cf45738b28e499cb8ffe74.jpg","https://cdn.shibe.online/shibes/0b77f74a5d9afaa4b5094b28a6f3ee60efcb3874.jpg","https://cdn.shibe.online/shibes/adccfdf7d4d3332186c62ed8eb254a49b889c6f9.jpg","https://cdn.shibe.online/shibes/3aac69180f777512d5dabd33b09f531b7a845331.jpg","https://cdn.shibe.online/shibes/1d25e4f592db83039585fa480676687861498db8.jpg","https://cdn.shibe.online/shibes/d8349a2436420cf5a89a0010e91bf8dfbdd9d1cc.jpg","https://cdn.shibe.online/shibes/eb465ef1906dccd215e7a243b146c19e1af66c67.jpg","https://cdn.shibe.online/shibes/3d14e3c32863195869e7a8ba22229f457780008b.jpg","https://cdn.shibe.online/shibes/79cedc1a08302056f9819f39dcdf8eb4209551a3.jpg","https://cdn.shibe.online/shibes/4440aa827f88c04baa9c946f72fc688a34173581.jpg","https://cdn.shibe.online/shibes/94ea4a2d4b9cb852e9c1ff599f6a4acfa41a0c55.jpg","https://cdn.shibe.online/shibes/f4478196e441aef0ada61bbebe96ac9a573b2e5d.jpg","https://cdn.shibe.online/shibes/96d4db7c073526a35c626fc7518800586fd4ce67.jpg","https://cdn.shibe.online/shibes/196f3ed10ee98557328c7b5db98ac4a539224927.jpg","https://cdn.shibe.online/shibes/d12b07349029ca015d555849bcbd564d8b69fdbf.jpg","https://cdn.shibe.online/shibes/80fba84353000476400a9849da045611a590c79f.jpg","https://cdn.shibe.online/shibes/94cb90933e179375608c5c58b3d8658ef136ad3c.jpg","https://cdn.shibe.online/shibes/8447e67b5d622ef0593485316b0c87940a0ef435.jpg","https://cdn.shibe.online/shibes/c39a1d83ad44d2427fc8090298c1062d1d849f7e.jpg","https://cdn.shibe.online/shibes/6f38b9b5b8dbf187f6e3313d6e7583ec3b942472.jpg","https://cdn.shibe.online/shibes/81a2cbb9a91c6b1d55dcc702cd3f9cfd9a111cae.jpg","https://cdn.shibe.online/shibes/f1f6ed56c814bd939645138b8e195ff392dfd799.jpg","https://cdn.shibe.online/shibes/204a4c43cfad1cdc1b76cccb4b9a6dcb4a5246d8.jpg","https://cdn.shibe.online/shibes/9f34919b6154a88afc7d001c9d5f79b2e465806f.jpg","https://cdn.shibe.online/shibes/6f556a64a4885186331747c432c4ef4820620d14.jpg","https://cdn.shibe.online/shibes/bbd18ae7aaf976f745bc3dff46b49641313c26a9.jpg","https://cdn.shibe.online/shibes/6a2b286a28183267fca2200d7c677eba73b1217d.jpg","https://cdn.shibe.online/shibes/06767701966ed64fa7eff2d8d9e018e9f10487ee.jpg","https://cdn.shibe.online/shibes/7aafa4880b15b8f75d916b31485458b4a8d96815.jpg","https://cdn.shibe.online/shibes/b501169755bcf5c1eca874ab116a2802b6e51a2e.jpg","https://cdn.shibe.online/shibes/a8989bad101f35cf94213f17968c33c3031c16fc.jpg","https://cdn.shibe.online/shibes/f5d78feb3baa0835056f15ff9ced8e3c32bb07e8.jpg","https://cdn.shibe.online/shibes/75db0c76e86fbcf81d3946104c619a7950e62783.jpg","https://cdn.shibe.online/shibes/8ac387d1b252595bbd0723a1995f17405386b794.jpg","https://cdn.shibe.online/shibes/4379491ef4662faa178f791cc592b52653fb24b3.jpg","https://cdn.shibe.online/shibes/4caeee5f80add8c3db9990663a356e4eec12fc0a.jpg","https://cdn.shibe.online/shibes/99ef30ea8bb6064129da36e5673649e957cc76c0.jpg","https://cdn.shibe.online/shibes/aeac6a5b0a07a00fba0ba953af27734d2361fc10.jpg","https://cdn.shibe.online/shibes/9a217cfa377cc50dd8465d251731be05559b2142.jpg","https://cdn.shibe.online/shibes/65f6047d8e1d247af353532db018b08a928fd62a.jpg","https://cdn.shibe.online/shibes/fcead395cbf330b02978f9463ac125074ac87ab4.jpg","https://cdn.shibe.online/shibes/79451dc808a3a73f99c339f485c2bde833380af0.jpg","https://cdn.shibe.online/shibes/bedf90869797983017f764165a5d97a630b7054b.jpg","https://cdn.shibe.online/shibes/dd20e5801badd797513729a3645c502ae4629247.jpg","https://cdn.shibe.online/shibes/88361ee50b544cb1623cb259bcf07b9850183e65.jpg","https://cdn.shibe.online/shibes/0ebcfd98e8aa61c048968cb37f66a2b5d9d54d4b.jpg"]
            let kya = list[Math.floor(Math.random() * list.length)]
            client.sendFileFromUrl(from, kya, 'Dog.jpeg', 'Inu')
            break
        case '!neko':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            q2 = Math.floor(Math.random() * 900) + 300;
            q3 = Math.floor(Math.random() * 900) + 300;
            client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
            break
        case '!sendto':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
        if (!isOwner) return client.reply(from, 'Perintah ini hanya untuk Owner bot anjay!', id)
            client.sendFile(from, './msgHndlr.js', 'msgHndlr.js')
            break
        case '!ss':
        case '!url2img':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const _query = body.slice(9)
            if (!_query.match(isUrl)) return client.reply(from, mess.error.Iv, id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!url2img [web]*\nContoh *!url2img https://google.com*', id)
            const url2img = await get.get(`https://api.apiflash.com/v1/urltoimage?access_key=12f6297102b447feb8e2aeca222f92b6&url=${_query}`).json()
            if (url2img.error) return client.reply(from, url2img.error, id)
            client.sendFileFromUrl(from, url2img.result, 'kyaa.jpg', null, id)
            break
        case '!quote':
        case '!quotes':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const quotes = await get.get('https://mhankbarbar.herokuapp.com/api/randomquotes').json()
            client.reply(from, `➸ *Quotes* : ${quotes.quotes}\n➸ *Author* : ${quotes.author}`, id)
            break
        case '!quotesnime':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const skya = await get.get('https://mhankbarbar.herokuapp.com/api/quotesnime/random').json()
            skya_ = skya.data
            client.reply(from, `➸ *Quotes* : ${skya_.quote}\n➸ *Character* : ${skya_.character}\n➸ *Anime* : ${skya_.anime}`, id)
            break
        case '!memer':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
            const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
            client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break
        case '!help':
        case '!menu':
        if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database IZUMI-BOT!\n Silakan daftar dengan format:\n*!register* <nama | daerah> \ncontoh:\n*!register* Yuuru | Trenggalek',id)
            client.sendText(from, help)
            break
        case '!readme':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            client.reply(from, readme, id)
            break
        case '!info':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            client.sendLinkWithAutoPreview(from, 'kalo mau donasi chat gw aja ya https://wa.me/6287743210434', info)
            break
        case '!snk':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            client.reply(from, snk, id)
            break
        case '!groupinfo':
                 if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                if (!isGroupMsg) return client.reply(from, '❌ Command ini hanya bisa digunakan di group saja anjay! [GROUP ONLY]', id)
                let groupName = name
                let groupDesc = chat.groupMetadata.desc
                let groupPic = await client.getProfilePicFromServer(chat.id)
                let totalMem = chat.groupMetadata.participants.length
                let groupOwner = chat.groupMetadata.owner
                if (groupPic === undefined) {
                    var pfp = errorurl
                } else {
                    var pfp = groupPic
                }
                await client.sendFileFromUrl(from, pfp, 'group.jpg', `*${groupName}*\n\n👥 *Member: ${totalMem}*\n🗒️ *Deskripsi grup*:\n${groupDesc}`, null, null, true)
                    .then(() => client.sendTextWithMentions(from, `Group owner: @${groupOwner}`))
            breaks

        case '!infosurah':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
          client.reply(from, 'Siapa saja yang membaca satu huruf dari Kitabullah (Al-Quran), maka dia akan mendapatkan satu kebaikan.', id)
          const inpo = await get.get('https://api.banghasan.com/quran/format/json/acak').json()
          client.sendText(from, `Berikut adalah Deskripsi dari *Surah ${inpo.surat.nama}* \n\n⚜ *Nomor Surah:* ${inpo.surat.nomor}\n⚜ *Nama Surah:* ${inpo.surat.nama} (${inpo.surat.asma})\n⚜ *Jumlah Ayat:* ${inpo.surat.ayat}\n⚜ *Golongan Surah:* ${inpo.surat.type}\n⚜ *Arti Surah:* ${inpo.surat.arti}\n⚜ *Keterangan Surah:*\n ${inpo.surat.keterangan}`)
        break

        case '!randomsurah':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
          client.reply(from, 'Siapa saja yang membaca satu huruf dari Kitabullah (Al-Quran), maka dia akan mendapatkan satu kebaikan.', id)
          const randomayat = await get.get('https://api.banghasan.com/quran/format/json/acak').json()
          client.sendText(from, `Berikut adalah adalah potongan ayat dari *QS. ${randomayat.surat.nama} (${randomayat.acak.ar.surat}) : ${randomayat.acak.ar.ayat}* \n\n ${randomayat.acak.ar.teks}\n${randomayat.acak.id.teks} *QS. ${randomayat.surat.nama} (${randomayat.acak.ar.surat}) : ${randomayat.acak.ar.ayat}*`)
        break

        case '!corona':
                if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                client.reply(from, 'Tunggu sebentar yaaa....', id)
                const kopit = await get.get('https://api.terhambar.com/negara/Indonesia').json()
                client.sendText(from, `*DATA COVID-19 DI ${kopit.negara}*\ntetap jaga jarak, gunakan masker, dan jangan berkerumun! 😷\n⚜Kasus baru: ${kopit.kasus_baru}\n⚜Meninggal baru: ${kopit.meninggal_baru}\n⚜Total kasus: ${kopit.total}\n⚜Total meninggal: ${kopit.meninggal}\n⚜Sembuh: ${kopit.sembuh}\n⚜Dalam penanganan: ${kopit.penanganan}\n\n⚜Diupdate: ${kopit.terakhir}`)
            break
        case '!manga':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!manga [Judul Manga]*\nContoh : *!manga Domestic no Kanojo*', id)
            const mangak = await get.get(`https://arugaz.herokuapp.com/api/komiku?q=${body.slice(7)}`).json()
            if (mangak.error) return client.reply(from, mangak.error, id)
            const res_mangak = `⚜ *Info Manga:*\n\n${mangak.genre}\n${mangak.info}\n\n⚜ *Sinopsis*:\n${mangak.sinopsis}\n\n⚜ *Link Download:*\n\n${mangak.link_dl}`
            client.sendFileFromUrl(from, mangak.thumb, 'dewabatch.jpg', res_mangak, id)
            break
        case '!gay':
                if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                client.reply(from, 'Penasaran seberapa GAY sih kamu...', id)
                const gay = await get.get('https://arugaz.herokuapp.com/api/howgay').json()
                client.sendText(from, `\n*${gay.desc}*\n\n\n⚜Persentase GAY anda sebesar: ${gay.persen}%\n`)
            break

        case '!bucin':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                client.reply(from, 'Gombalan maut akan segera datang...', id)
                const cin = await get.get('https://arugaz.herokuapp.com/api/howbucins').json()
                client.sendText(from, `\n*${cin.desc}*\nDamage Gombalan Sebesar: ${cin.persen}%\n`)
            break

        case '!cerpen':
                if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                client.reply(from, 'Sedang mencari cerpen yang sesuai mood kamu senpai...', id)
                const cerpenn = await get.get('https://arugaz.herokuapp.com/api/cerpen').json()
                client.sendText(from, `\n${cerpenn.result}\n`)
            break

        case '!cersex':
                if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                client.reply(from, 'Sedang mencari cerpen yang dapat memuaskan nafsumu kamu senpai...', id)
                const cer = await get.get('https://arugaz.herokuapp.com/api/cersex1').json()
                client.sendText(from, `\n*${cer.result.judul}*\n\n${cer.result.article}`)
            break


        case '!puisi':
                if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                client.reply(from, 'Sedang mencari puisi yang dapat melelehkan hatimu senpai...', id)
                const puisii = await get.get('https://arugaz.herokuapp.com/api/puisi2').json()
                client.sendText(from, `\n${puisii.result}`)
            break
        
        case '!vidsex':
                if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                client.reply(from, 'Peringatan!!! ini adalah konten dewasa...', id)
                const vid = await get.get('https://arugaz.herokuapp.com/api/indohot').json()
                client.sendText(from, `*VIDEO KHUSUS 18+*\n\nJudul: ${vid.result.judul}\nGenre: ${vid.result.genre}\nDurasi Video: ${vid.result.durasi}\nLink Download: ${vid.result.url}`)
            break

        case '!penyegar':
            const items = ["School Girl Japan","Japan Girl","Beautiful Japanese Girl"]
            const cewe = items[Math.floor(Math.random() * items.length)]
            const ewe = 'https://api.fdci.se/rep.php?gambar=' + cewe
            axios.get(ewe)
                .then(async (result) => {
                    const x = JSON.parse(JSON.stringify(result.data))
                    const cewek = x[Math.floor(Math.random() * x.length)]
                    await client.sendFileFromUrl(from, cewek, 'penyegar.jpg', '', id)
                })
        break

        case '!nama':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!nama [query]*\nContoh : *!nama izumi*', id)
            const isi_ = body.slice(6)
            const nama = await get.get(`https://arugaz.herokuapp.com/api/artinama?nama=${isi_}`).json()
            if (nama.error) {
                client.reply(from, nama.error, id)
            } else {
                client.reply(from, `Hai, *${isi_}* kamu adalah seorang yang ${nama.result}`, id)
            }
            break

        case '!call':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
                if (!isOwner) return client.reply(from, 'Ini khusus buat mainan nya owner bot, lu gak usah ikut ikutan :(', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!call [nomor target]*', id)
            const cal_ = body.slice(6)
            const call = await get.get(`https://alfians-api.herokuapp.com/api/spamcall?no=${cal_}`).json()
            if (call.error) {
                client.reply(from, call.error, id)
            } else {
                client.reply(from, `${call.logs}`, id)
            }
            break

        //Sticker Converter
        case '!st2img':
                if (quotedMsg && quotedMsg.type == 'sticker') {
                    const mediaData = await decryptMedia(quotedMsg)
                    client.reply(from, `Sedamg di proses! Silahkan tunggu sebentar...`, id)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendFile(from, imageBase64, 'imgsticker.jpg', 'Berhasil convert Sticker to Image!', id)
                    .then(() => {
                        console.log(`Sticker to Image Processed for ${processTime(t, moment())} Seconds`)
                    })
            } else if (!quotedMsg) return client.reply(from, `Format salah, silahkan tag sticker yang ingin dijadikan gambar!`, id)
            break

        case '!jatidiri':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!nama [query]*\nContoh : *!nama izumi*', id)
            const pas_ = body.slice(6)
            const sip_ = body.slice(6)
            const jodoh = await get.get(`https://arugaz.herokuapp.com/api/jodohku?nama=${pas_}&pasangan=${pas_}`).json()
            if (jodoh.error) {
                client.reply(from, jodoh.error, id)
            } else {
                client.reply(from, `Jati diri kamu yang sebenarnya adalah seorang yang ${jodoh.positif}\n\nNamun kamu memiliki kekurangan seperti ${jodoh.negatif}`, id)
            }
            break

        case '!yo':
            if (!isOwner) return client.reply(from, 'Ini khusus buat mainan nya owner bot, lu gak usah ikut ikutan :(', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!yo [query]*\nContoh : *!halo bang*', id)
            const yo_ = body.slice(6)
            const lo = await get.get(`https://arugaz.herokuapp.com/api/simisimi?kata=${yo_}&apikey=dG.GN.Jbm6GBfjb~5uCyqCOGg0hcT2sWlozA0Y5x`).json()
            if (lo.error) {
                client.reply(from, lo.error, id)
            } else {
                client.reply(from, `${lo.result}`, id)
            }
            break

        case '!say':
            if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            if (args.length === 1) return client.reply(from, 'Kirim perintah *!say [query]*\nContoh : *!halo bang*', id)
            const say_ = body.slice(6)
            const brol = await get.get(`https://simsumi.herokuapp.com/api?text=[${say_}]&lang=[id]`).json()
            if (brol.error) {
                client.reply(from, brol.error, id)
            } else {
                client.reply(from, `${brol.success}`, id)
            }
            break

        case '!botstat': {
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.sendText(from, `Status :\n- *${loadedMsg}* Loaded Messages\n- *${groups.length}* Group Chats\n- *${chatIds.length - groups.length}* Personal Chats\n- *${chatIds.length}* Total Chats`)
            break
        }
        case '!ban':
            if (!isOwner) return await client.reply(from, 'Ini khusus buat mainan nya owner bot, lu gak usah ikut ikutan :(', id)
            if (mentionedJidList.length === 0) return await client.reply(from, 'pilih !ban add atau !ban del cuk', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, ind.wrongFormat(), id)
            if (args[1] === 'add') {
            for (let blist of mentionedJidList) {
                banned.push(blist)
                fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
            }
                await client.reply(from, 'berhasil di banned', id)
            } else if (args[1] === 'del') {
                let benet = banned.indexOf(mentionedJidList[0])
                banned.splice(benet, 1)
                fs.writeFileSync('./lib/banned.json', JSON.stringify(banned))
                await client.reply(from, 'berhasil di unban', id)
            } else {
                await client.reply(from, 'gagal', id)
            }
        break

        case '!wallanime':
        if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const itu = ["Wallpaper Anime Cute Girl", "Wallpaper Anime ", "Wallpaper Anime HD", "Anime Wallpaper"]
            const wallnime = itu[Math.floor(Math.random() * itu.length)]
            const nimeng = 'https://api.fdci.se/rep.php?gambar=' + wallnime
            axios.get(nimeng)
                .then(async (result) => {
                    const a = JSON.parse(JSON.stringify(result.data))
                    const nimer = a[Math.floor(Math.random() * a.length)]
                    await client.sendFileFromUrl(from, nimer, 'penyegar.jpg', '', id)
                })
        break

        case '!waifu':
        if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const wai = ["kawaii anime girl", "waifu", "Hot Anime Girl", "Cool Anime Girl"]
            const ifu = wai[Math.floor(Math.random() * wai.length)]
            const cute = 'https://api.fdci.se/rep.php?gambar=' + ifu
            axios.get(cute)
                .then(async (result) => {
                    const t = JSON.parse(JSON.stringify(result.data))
                    const pict = t[Math.floor(Math.random() * t.length)]
                    await client.sendFileFromUrl(from, pict, 'penyegar.jpg', '', id)
                })
        break

        case '!husbu':
        if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const hus = ["Hot Anime Boy", "Husbu", "Cool Anime Boys", "Anime Boy Keren"]
            const bu = hus[Math.floor(Math.random() * hus.length)]
            const cool = 'https://api.fdci.se/rep.php?gambar=' + bu
            axios.get(cool)
                .then(async (result) => {
                    const h = JSON.parse(JSON.stringify(result.data))
                    const mpshh = h[Math.floor(Math.random() * h.length)]
                    await client.sendFileFromUrl(from, mpshh, 'penyegar.jpg', '', id)
                })
        break

        case '!meme':
        if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
            const pmeme = ["Meme Shitpost", "meme kocak", "shitpost indonesia", "wibu kocak"]
            const njir = pmeme[Math.floor(Math.random() * pmeme.length)]
            const shitpost = 'https://api.fdci.se/rep.php?gambar=' + njir
            axios.get(shitpost)
                .then(async (result) => {
                    const q = JSON.parse(JSON.stringify(result.data))
                    const lucu = q[Math.floor(Math.random() * q.length)]
                    await client.sendFileFromUrl(from, lucu, 'penyegar.jpg', '', id)
                })
        break

    	case '!pt':
    	if (!isRegistered) return await client.reply(from, 'Nomor kamu belum terdaftar di database! Silakan daftar dengan format:\n*!register* <nama | daerah>', id)
			if (!isRegistered) return await client.reply(from, 'Foo', id)
		    if (args.length === 1) return await client.reply(from, 'Bar', id)
		    const pin = body.slice(5)
		    const xyz = `https://api.fdci.se/rep.php?gambar=${pin}`
		    axios.get(xyz)
		    	.then(async (res) => {
		    		const q = JSON.parse(JSON.stringify(res.data))
		            const rand = q[Math.floor(Math.random() * q.length)]
		            await client.sendFileFromUrl(from, rand, `${pin}.jpg`, '', id)
		    	})
		break

    }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
