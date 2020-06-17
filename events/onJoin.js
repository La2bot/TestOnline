const { privateWelcome, publicWelcome, welcomeChannels, autoRole } = require('../config.json')

const formatMessage = (message, member) => {
  return message
    .replace(/%member/gi, member)
    .replace(/%username/gi, member.user.username)
    .replace(/%tag/gi, member.user.tag)
    .replace(/%server/gi, member.guild.name)
}

module.exports = async (bot, member) => {
  if (autoRole.length > 0) {
    member.roles.add(autoRole).catch(console.error)
  }

  try {
    if (publicWelcome) {
      welcomeChannels.forEach(async (welcomeChannel) => {
        const welcomeChan = await bot.channels.fetch(welcomeChannel)
        if (!welcomeChan) return console.log('This channel does not exist', 'welcomeChan', welcomeChan)
        welcomeChan.send(formatMessage(publicWelcome, member))
      })
    }

    if (privateWelcome) {
      const userJoined = await bot.users.fetch(member.id)
      if (!userJoined) return console.log('This user does not exist', 'userJoined', userJoined)
      userJoined.send(formatMessage(privateWelcome, member)).catch(console.error)
    }
  } catch (error) {
    console.error(error)
  }
}
