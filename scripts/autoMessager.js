const { autoMessage, autoMessageChannel, autoMessageInterval } = require('../config.json')

module.exports = async (bot) => {
  const channel = await bot.channels.fetch(autoMessageChannel)
  setInterval(() => {
    channel.send(autoMessage)
  }, 1000 * 60 * autoMessageInterval)
}
