const Discord = require('discord.js'),
  { token, prefix, enableAutoMessage, admins } = require('./config.json')

const giveaway = require('./commands/giveaway')
const help = require('./commands/help')
const joinHandler = require('./events/onJoin')
const autoMessager = require('./scripts/autoMessager')

const bot = new Discord.Client()

const botSettings = (bot) => {
  return `\n-- Bot Settings --\nToken: ${token}\nPrefix: ${prefix}\nBot Name: ${bot.user.username}\nBot ID: ${bot.user.id}\nAuthor: xyz#6990 [fiverr.com/quantumshmoolon]`
}

const readyHandler = (bot) => {
  console.log(`Giveaway bot is ready!\n${botSettings(bot)}`)
  if (!enableAutoMessage) return
  autoMessager(bot)
}

const messageHandler = (bot, message) => {
  const messageArray = message.content.split(' ')
  const cmd = messageArray[0].slice(1)
  let args = messageArray.slice(prefix.length).filter((x) => x)

  if (admins.length > 0) if (!admins.includes(message.author.id)) return

  if (cmd == 'giveaway') giveaway(bot, message, args)
  if (cmd == 'help') help(bot, message, args)
}

let eventsHandler = {
  onReady: (bot) => readyHandler(bot),
  onRatelimit: (data) => console.log("You're getting rate limited. Too API many requests are made", data),
  onWarn: (warn) => console.warn('Warn!', warn),
  onError: (error) => console.error('Unexpected error!', error),
  onDisconnect: (reason) => console.log('The bot has been disconnected!', reason),
  onMessage: (bot, message) => messageHandler(bot, message),
  onJoin: (bot, member) => joinHandler(bot, member),
}

bot
  .on('ready', () => eventsHandler.onReady(bot))
  //.on('rateLimit', eventsHandler.onRatelimit)
  .on('warn', eventsHandler.onWarn)
  .on('error', eventsHandler.onError)
  .on('disconnect', eventsHandler.onDisconnect)
  .on('message', (m) => eventsHandler.onMessage(bot, m))
  .on('guildMemberAdd', (m) => eventsHandler.onJoin(bot, m))

bot.login(token)
