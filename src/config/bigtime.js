const BigTime = require('bigtime-sdk')
const bigTime = new BigTime({
  username: process.env.BIGTIME_USERNAME,
  password: process.env.BIGTIME_PASSWORD
})

module.exports = bigTime
