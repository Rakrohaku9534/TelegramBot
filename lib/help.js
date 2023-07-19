const fs = require('fs')
const config = JSON.parse(fs.readFileSync(`./config.json`))

exports.start = async(lol, name) => {
    text = `Hai kak 👋🏻 ${name}! selamat datang di BotzAku, di buat dan di kembangkan oleh [iikyy](${config.ownerLink}). Ketik /menu untuk melihat perintah!`
    await lol.replyWithMarkdown(text, { disable_web_page_preview: true })
}

exports.help = async(lol, name, user_id) => {
    text = `Hai ${name}! ini beberapa perintah yang dapat kamu gunakan :`
    options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'AI 📝', callback_data: 'iikyyAI-' + user_id }
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
    text = `iikyyAI Menu :

❏ ${prefix}ai
❏ ${prefix}openai
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