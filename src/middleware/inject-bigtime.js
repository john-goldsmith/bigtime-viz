module.exports = (req, res, next) => {
  // const bigTime = keystone.get('bigTime')
  res.locals.bigTime = bigTime
  next()
}
