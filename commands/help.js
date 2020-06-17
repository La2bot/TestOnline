const { MessageEmbed } = require('discord.js'),
  { prefix } = require('../config.json')

module.exports = async (bot, message, args) => {
  args = args
    .join(' ')
    .split('|')
    .map((x) => x.trim())
    .filter((x) => x)

  console.log('args', args)

  const embed = new MessageEmbed()
  //!giveaway 1000 DP Giveaway | 5 | 10h | #giveaways
  if (args.length <= 0) {
    embed
      .setTitle('Help')
      .setDescription(
        `Prefix: ${prefix}\nAvailable commands: \`giveaway\`, \`help\`\nUse \`${prefix}help giveaway\``,
      )
      .setColor('BLUE')
      .setTimestamp()
  } else if (args.length == 1 && args[0] == 'giveaway') {
    embed
      .setTitle('Giveaway Command')
      .setDescription(
        `\`Format\`\n${prefix}giveaway {TITLE} | {WINNERS} | {TIME_LIMIT} | {CHANNEL} | {WINNERS_IDS}\n\`Example\`\n${prefix}giveaway 1000 DP Giveaway (200 each) | 5 | 10h | #giveaways | 690557218013315192 608000475639578659 683020807655653400`,
      )
      .setColor('RED')
      .setTimestamp()
  }

  message.author.send(embed)
}
