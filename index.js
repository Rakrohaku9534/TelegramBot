const { fetchJson, range, parseMarkdown } = require('./lib/function')
const { Telegraf, Context } = require('telegraf')
const help = require('./lib/help')
const tele = require('./lib/tele')
const chalk = require('chalk')
const os = require('os')
const fs = require('fs')
const { Configuration, OpenAIApi } = require("openai");

const { bot_token, owner, ownerLink, version, prefix } = JSON.parse(fs.readFileSync(`./config.json`))

let entertainment = {}

if (bot_token == '') {
	return console.log('=== BOT TOKEN CANNOT BE EMPTY ===')
}

const bot = new Telegraf(bot_token)

bot.command('start', async (lol) => {
	user = tele.getUser(lol.message.from)
	await help.start(lol, user.full_name)
	await lol.deleteMessage()
})

bot.command('menu', async (lol) => {
	user = tele.getUser(lol.message.from)
	await help.help(lol, user.full_name, lol.message.from.id.toString())
})

bot.command('tqto', async (lol) => {
	user = tele.getUser(lol.message.from)
	await help.tqto(lol, user.full_name, lol.message.from.id.toString())
})

bot.command('info', async (lol) => {
	user = tele.getUser(lol.message.from)
	await help.infobot(lol, user.full_name, lol.message.from.id.toString())
})

bot.on('callback_query', async (lol) => {
	cb_data = lol.callbackQuery.data.split('-')
	user_id = Number(cb_data[1])
	if (lol.callbackQuery.from.id != user_id) return lol.answerCbQuery('Sorry, You do not have the right to access this button.', { show_alert: true })
	callback_data = cb_data[0]
	user = tele.getUser(lol.callbackQuery.from)
	const isGroup = lol.chat.type.includes('group')
	const groupName = isGroup ? lol.chat.title : ''
	if (!isGroup) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ ACTIONS ]'), chalk.whiteBright(callback_data), chalk.greenBright('from'), chalk.whiteBright(user.full_name))
	if (isGroup) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ ACTIONS ]'), chalk.whiteBright(callback_data), chalk.greenBright('from'), chalk.whiteBright(user.full_name), chalk.greenBright('in'), chalk.whiteBright(groupName))
	if (callback_data == 'help') return await help[callback_data](lol, user.full_name, user_id)
	await help[callback_data](lol, user_id.toString())
})

bot.on('message', async (lol) => {
	try {
		const body = lol.message.text || lol.message.caption || ''
		comm = body.trim().split(' ').shift().toLowerCase()
		cmd = false
		if (prefix != '' && body.startsWith(prefix)) {
			cmd = true
			comm = body.slice(1).trim().split(' ').shift().toLowerCase()
		}
		const command = comm
		const args = await tele.getArgs(lol)
		const user = tele.getUser(lol.message.from)

		const reply = async (text) => {
			for (var x of range(0, text.length, 4.096)) {
				return await lol.replyWithMarkdown(text.substr(x, 4096), { disable_web_page_preview: true })
			}
		}

		if (entertainment[lol.update.message.from.id] && entertainment[lol.update.message.from.id] === lol.update.message.text.toLowerCase()) {
			delete entertainment[lol.update.message.from.id]
			return reply('Jawaban Anda benar.')
		}

		const isCmd = cmd
		const isGroup = lol.chat.type.includes('group')
		const groupName = isGroup ? lol.chat.title : ''

		const isImage = lol.message.hasOwnProperty('photo')
		const isVideo = lol.message.hasOwnProperty('video')
		const isAudio = lol.message.hasOwnProperty('audio')
		const isSticker = lol.message.hasOwnProperty('sticker')
		const isContact = lol.message.hasOwnProperty('contact')
		const isLocation = lol.message.hasOwnProperty('location')
		const isDocument = lol.message.hasOwnProperty('document')
		const isAnimation = lol.message.hasOwnProperty('animation')
		const isMedia = isImage || isVideo || isAudio || isSticker || isContact || isLocation || isDocument || isAnimation

		const quotedMessage = lol.message.reply_to_message || {}
		const isQuotedImage = quotedMessage.hasOwnProperty('photo')
		const isQuotedVideo = quotedMessage.hasOwnProperty('video')
		const isQuotedAudio = quotedMessage.hasOwnProperty('audio')
		const isQuotedSticker = quotedMessage.hasOwnProperty('sticker')
		const isQuotedContact = quotedMessage.hasOwnProperty('contact')
		const isQuotedLocation = quotedMessage.hasOwnProperty('location')
		const isQuotedDocument = quotedMessage.hasOwnProperty('document')
		const isQuotedAnimation = quotedMessage.hasOwnProperty('animation')
		const isQuoted = lol.message.hasOwnProperty('reply_to_message')

		var typeMessage = body.substr(0, 50).replace(/\n/g, '')
		if (isImage) typeMessage = 'Image'
		else if (isVideo) typeMessage = 'Video'
		else if (isAudio) typeMessage = 'Audio'
		else if (isSticker) typeMessage = 'Sticker'
		else if (isContact) typeMessage = 'Contact'
		else if (isLocation) typeMessage = 'Location'
		else if (isDocument) typeMessage = 'Document'
		else if (isAnimation) typeMessage = 'Animation'

		if (!isGroup && !isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ PRIVATE ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name))
		if (isGroup && !isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[  GROUP  ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name), chalk.greenBright('in'), chalk.whiteBright(groupName))
		if (!isGroup && isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ COMMAND ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name))
		if (isGroup && isCmd) console.log(chalk.whiteBright('├'), chalk.cyanBright('[ COMMAND ]'), chalk.whiteBright(typeMessage), chalk.greenBright('from'), chalk.whiteBright(user.full_name), chalk.greenBright('in'), chalk.whiteBright(groupName))

		var file_id = ''
		if (isQuoted) {
			file_id = isQuotedImage
				? lol.message.reply_to_message.photo[lol.message.reply_to_message.photo.length - 1].file_id
				: isQuotedVideo
				? lol.message.reply_to_message.video.file_id
				: isQuotedAudio
				? lol.message.reply_to_message.audio.file_id
				: isQuotedDocument
				? lol.message.reply_to_message.document.file_id
				: isQuotedAnimation
				? lol.message.reply_to_message.animation.file_id
				: ''
		}
		var mediaLink = file_id != '' ? await tele.getLink(file_id) : ''

		switch (command) {
	    case 'help':
				await help.help(lol, user.full_name, lol.message.from.id.toString())
				break
				
		 case 'ai':
	          if (args.length == 0) return await reply(`Contoh : ${prefix + command} siapa itu Megawati?`)
	          query = args.join(' ')
	          reply(`mohon tunggu sebentar, mungkin ini membutuhkan sedikit waktu...`)
              const configuration = new Configuration({
              apiKey: 'ISI_APIKEY_OPENAI_DISINI',
              });
             const openai = new OpenAIApi(configuration);
             const response = await openai.createChatCompletion({
             model: "gpt-3.5-turbo",
             messages: [{ role: "user", content: query }],
             });
             const aiResponse = response.data.choices[0].message.content;
             const limitedResponse = aiResponse.slice(0, 4096);
             reply(limitedResponse);
             break;
             
       case 'curhat':
             if (args.length == 0) return await reply(`Contoh : ${prefix + command} aku habis di putusin pacar`)
             const defaultText = 'tolong jawab curhatan berikut dan berpura-pura lah menjadi seorang teman';
             const curutliar = 'jika curhatan tersebut konyol, balas jawaban dengan jawaban lucu juga';
             const userQuery = args.join(' ');
             const query = `${defaultText}: “${userQuery}”. ${curutliar}`;
             reply(`sedang mengetik...`);
             const curhat = new Configuration({
             apiKey: 'ISI_APIKEY_OPENAI_DISINI',
             });
            const curhatt = new OpenAIApi(curhat);
            const curhattt = await curhatt.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: query }],
            });
            const curhatttt = curhattt.data.choices[0].message.content;
            const curhattttt = curhatttt.slice(0, 4096);
            reply(curhattttt);
            break;

       case 'dokter':
             if (args.length == 0) return await reply(`Contoh : ${prefix + command} kenapa kepala saya sakit sekali`)
             const doktergadungan = 'tolong jawab pertanyaan berikut dan berpura pura lah menjadi seorang dokter';
             const afterdoctor = 'Jika pertanyaan tersebut diluar dari dunia medis atau kedokteran, tidak perlu di tanggapi';
             const dokterabalabal = args.join(' ');
             const duktur = `${doktergadungan}: “${dokterabalabal}”. ${afterdoctor}`;
             reply(`dokter sedang mengetik...`);
             const dokter = new Configuration({
             apiKey: 'ISI_APIKEY_OPENAI_DISINI',
             });
            const dokterr = new OpenAIApi(dokter);
            const dokterrr = await dokterr.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: duktur }],
            });
            const dokterrrr = dokterrr.data.choices[0].message.content;
            const dokterrrrr = dokterrrr.slice(0, 4096);
            reply(dokterrrrr);
            break;
            
       case 'quotes':
             const semvak = 'carikan quotes berbahasa indonesia pendek bebas satu saja';
             const lirik = new Configuration({
             apiKey: 'ISI_APIKEY_OPENAI_DISINI',
             });
            const lirikk = new OpenAIApi(lirik);
            const lirikkk = await lirikk.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: semvak }],
            });
            const lirikkkk = lirikkk.data.choices[0].message.content;
            const lirikkkkk = lirikkkk.slice(0, 4096);
            reply(lirikkkkk);
            break;
            
       case 'pantun':
             const bogel = 'carikan pantun berbahasa indonesia pendek dengan format 4 bait satu saja';
             const pantun = new Configuration({
             apiKey: 'ISI_APIKEY_OPENAI_DISINI',
             });
            const pantunn = new OpenAIApi(pantun);
            const pantunnn = await pantunn.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: bogel }],
            });
            const pantunnnn = pantunnn.data.choices[0].message.content;
            const pantunnnnn = pantunnnn.slice(0, 4096);
            reply(pantunnnnn);
            break;
    

		}
	} catch (e) {
		console.log(chalk.whiteBright('├'), chalk.cyanBright('[  ERROR  ]'), chalk.redBright(e))
	}
})

bot.launch({
	dropPendingUpdates: true,
})
bot.telegram.getMe().then((getme) => {
	itsPrefix = prefix != '' ? prefix : 'No Prefix'
	console.log(chalk.greenBright(' ===================================================='))
	console.log(chalk.greenBright(' │ + Owner    : ' + owner || ''))
	console.log(chalk.greenBright(' │ + Bot Name : ' + getme.first_name || ''))
	console.log(chalk.greenBright(' │ + Version  : ' + version || ''))
	console.log(chalk.greenBright(' │ + Host     : ' + os.hostname() || ''))
	console.log(chalk.greenBright(' │ + Platfrom : ' + os.platform() || ''))
	console.log(chalk.greenBright(' │ + Prefix   : ' + itsPrefix))
	console.log(chalk.greenBright(' ===================================================='))
	console.log(chalk.whiteBright('╭─── [ LOG ]'))
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
