module.exports = (time, text) => {
  if (!time) return null
  time = time.toLowerCase()
  const timeObj = {
    value: null,
    unit: null,
    set: (value, unit) => {
      timeObj.value = value
      timeObj.unit = unit
    },
  }

  const { set } = timeObj

  if (!time) return null

  if (time.endsWith('minutes') && !isNaN(time.slice(0, time.length - 7)))
    set(time.slice(0, time.length - 7), 'minutes')
  else if (time.endsWith('min') && !isNaN(time.slice(0, time.length - 3)))
    set(time.slice(0, time.length - 3), 'minutes')
  else if (time.endsWith('m') && !isNaN(time.slice(0, time.length - 1)))
    set(time.slice(0, time.length - 1), 'minutes')
  else if (time.endsWith('s') && !isNaN(time.slice(0, time.length - 1)))
    set(time.slice(0, time.length - 1), 'seconds')
  else if (time.endsWith('sec') && !isNaN(time.slice(0, time.length - 3)))
    set(time.slice(0, time.length - 3), 'seconds')
  else if (time.endsWith('seconds') && !isNaN(time.slice(0, time.length - 7)))
    set(time.slice(0, time.length - 7), 'seconds')
  else if (time.endsWith('h') && !isNaN(time.slice(0, time.length - 1)))
    set(time.slice(0, time.length - 1), 'hours')
  else if (time.endsWith('hours') && !isNaN(time.slice(0, time.length - 5)))
    timeObj.set(time.slice(0, time.length - 5), 'hours')
  else if (time.endsWith('d') && !isNaN(time.slice(0, time.length - 1)))
    set(time.slice(0, time.length - 1), 'days')
  else if (time.endsWith('days') && !isNaN(time.slice(0, time.length - 4)))
    set(time.slice(0, time.length - 4), 'days')
  else if (time.endsWith('w') && !isNaN(time.slice(0, time.length - 1)))
    set(time.slice(0, time.length - 1), 'weeks')
  else if (time.endsWith('weeks') && !isNaN(time.slice(0, time.length - 5)))
    set(time.slice(0, time.length - 5), 'weeks')
  else return null

  const { value, unit } = timeObj
  let multiplier = 0

  if (unit == 'seconds') multiplier = 1000
  else if (unit == 'minutes') multiplier = 1000 * 60
  else if (unit == 'hours') multiplier = 1000 * 60 * 60
  else if (unit == 'days') multiplier = 1000 * 60 * 60 * 24
  else if (unit == 'weeks') multiplier = 1000 * 60 * 60 * 24 * 7
  if (text) return `${value} ${unit}`
  return value * multiplier
}
