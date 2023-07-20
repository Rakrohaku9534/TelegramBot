const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`./config.json`))

exports.start = async(lol, name) => {
    text = `Hai Kak 👋🏻 ${name}! selamat datang di BotzAku, di buat dan di kembangkan oleh [iikyy](${config.ownerLink}). Ketik /menu untuk melihat perintah!`
    await lol.replyWithMarkdown(text, { disable_web_page_preview: true })
}

exports.help = async(lol, name, user_id) => {
    text = `Hai Kak ${name}! ini beberapa perintah yang dapat kamu gunakan :`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Klik Disini 📝', callback_data: 'iikyyAI-' + user_id }
                ],
                [
                    { text: 'Info Bot 🤖', callback_data: 'info-' + user_id }
                ],
            ]
        }
    }
    try {
        await lol.editMessageText(text, options)
    } catch {
        await lol.reply(text, options)
    }
}

exports.iikyyAI = async(lol, user_id) => {
    prefix = config.prefix
    text = `AI Menu :

✗  ${prefix}ai
✗  ${prefix}curhat
✗  ${prefix}dokter
✗  ${prefix}quotes
✗  ${prefix}pantun

`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.info = async(lol, user_id) => {
    prefix = config.prefix
    text = `
𝗜𝗻𝗳𝗼 𝗕𝗼𝘁

Bot ini di buat dan di kembangkan oleh :
• kiki 
= instagram.com/iikyynd_04
• rani 
= instagram.com/hrnii_04

Note :
• bot masih dalam tahap pengembangan, dan saat ini hanya tersedia fitur Chat GPT!!

Other :
• telegram channel
= t.me/BotzAku
• telegram grup
= t.me/BotzGrup

Source :
• github.com/BotzIky/TelegramBot
`
    await lol.editMessageText(text, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back', callback_data: 'help-' + user_id }
                ]
            ]
        }
    })
}

exports.messageError = async(lol) => {
    await lol.reply(`Error! Please report to the [${config.owner}](${config.ownerLink}) about this`, { parse_mode: "Markdown", disable_web_page_preview: true })
}