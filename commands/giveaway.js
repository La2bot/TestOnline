const { MessageEmbed } = require('discord.js'),
  handleTime = require('../scripts/time'),
  { giveawayText, giveawayReaction, hostCanWin, contact, winnersResults } = require('../config.json')

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = async (bot, message, args) => {
  if (!message.guild) return message.reply('This command is only available to use in servers')
  if (args.join(' ').indexOf('|') == -1)
    return message.reply('Use ``|`` to separate arguments').then((m) => m.delete({ timeout: 10000 }))

  args = args
    .join(' ')
    .split('|')
    .map((x) => x.trim())
    .filter((x) => x)

  if (!args[0] || args[0].length <= 0)
    return message.reply('Invalid giveaway title').then((m) => m.delete({ timeout: 10000 }))

  if (!args[1] || args[1].length <= 0 || isNaN(args[1]))
    return message.reply('Invalid number of winners').then((m) => m.delete({ timeout: 10000 }))

  if (!args[2] || args[2].length <= 0)
    return message.reply('Invalid time limit').then((m) => m.delete({ timeout: 10000 }))

  if (!args[3] || args[3].length <= 0)
    return message.reply('Invalid giveaway channel').then((m) => m.delete({ timeout: 10000 }))

  const time = handleTime(args[2].split(' ').join(''))
  if (!time) return message.reply('Invalid time format').then((m) => m.delete({ timeout: 10000 }))

  const giveawayChannel = bot.channels.cache.get(args[3].slice(2, -1))
  if (!giveawayChannel)
    return message.reply('Provided text channel does not exist').then((m) => m.delete({ timeout: 10000 }))

  const numberOfWinners = parseInt(args[1])
  if (numberOfWinners <= 0)
    return message.reply('Invalid number of winners').then((m) => m.delete({ timeout: 10000 }))

  let artificalWinners = []
  if (args.length > 4) {
    artificalWinners = args[4].split(' ').filter((x) => x)
    if (artificalWinners.length > numberOfWinners)
      return message.reply('You provided more artifical winners than winners')
  }

  const embed = new MessageEmbed()
    .setTitle(args[0])
    .setAuthor(bot.user.tag, bot.user.displayAvatarURL())
    .setDescription(`Hosted by <@${message.author.id}>`)
    .setFooter(`Ends`)
    .setTimestamp(Date.now() + time)
    .setColor('RANDOM')

  const m = await giveawayChannel.send(giveawayText, { embed })
  await m.react(giveawayReaction)
  await m.react('🔚')

  const filter = (reaction, user) => {
    return (
      reaction.emoji.name === giveawayReaction ||
      (reaction.emoji.name === '🔚' && [message.author.id, message.guild.ownerID].includes(user.id))
    )
  }

  const collector = m
    .createReactionCollector(filter, {
      time,
    })
    .on('collect', (reaction, user) => {
      if (reaction.emoji.name == '🔚') collector.stop()
    })
    .on('end', async (collected, reason) => {
      if (m.deleted) return console.log('The message was deleted')

      let participants = []

      if (collected.array().length > 0) {
        participants = collected
          .array()[0]
          .users.cache.map((x) => x.id)
          .filter((x) => x != m.author.id)

        if (!hostCanWin) participants = participants.filter((x) => x != message.author.id)
      }

      const size = participants.length

      const embedSent = m.embeds[0]

      if (size <= 1) {
        embedSent.setDescription('The giveaway has ended\nToo few users joined it')
        return m.edit({ embed: new MessageEmbed(embedSent) })
      }

      let winners = []

      for (let q = 0; q < (numberOfWinners > size ? size : numberOfWinners); q++) {
        let randomInt = randomInteger(0, size - 1)
        if (!winners.includes(participants[randomInt])) {
          winners.push(participants[randomInt])
        } else {
          while (winners.includes(participants[randomInt])) {
            randomInt = randomInteger(0, size - 1)
          }
          winners.push(participants[randomInt])
        }
      }

      artificalWinners.forEach((x) => {
        if (winners.includes(x)) return
        let start = randomInteger(0, winners.length - 1)
        while (artificalWinners.includes(winners[start])) {
          start = randomInteger(0, winners.length - 1)
        }
        winners.splice(start, 1, x)
      })

      const results = winnersResults
        .replace(/%winners/gi, winners.map((x) => `<@${x}>`).join(' '))
        .replace(/%contact/gi, `<@${contact}>`)

      embedSent.setDescription(
        `Winners:\n${winners.map((x) => `<@${x}>`).join('\n')}\n\nHosted by <@${message.author.id}>`,
      )
      if (m.deleted) return console.log('The message was deleted')
      await m.edit({ embed: new MessageEmbed(embedSent) })
      await m.channel.send(results)
    })
}
