function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function dateFormatBeiJingToAtlanta (dateString) {
  var d = new Date()
  // Atlanta timezone difference comparing to Beijin
  var hours = 12 // daylight savings time
  if (/GMT-0500/.test(d)) {
    hours = 13 // Standard time
  }
  return formatTime(new Date(Date.parse(dateString) - hours * 3600 * 1000)) + ' EST'
}
module.exports = {
  formatTime,
  dateFormatBeiJingToAtlanta
}
