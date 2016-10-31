const keystone = require('keystone');

/**
 * [hasValidStaffCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidWeekendCookie(req) {
  return hasWeekendCookie(req) ? getWeekendCookie(req) : false;
}

/**
 * [hasValidStaffQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidWeekendQueryParam(req) {
  return hasWeekendQueryParam(req) ? getWeekendQueryParam(req) : false;
}

/**
 * [hasStaffQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasWeekendQueryParam(req) {
  return req.query && req.query['include-weekends'];
}

/**
 * [hasStaffCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasWeekendCookie(req) {
  const namespace = keystone.get('namespace');
  return req.cookies && req.cookies[`${namespace}.includeWeekends`];
}

/**
 * [getStaffQueryParam description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getWeekendQueryParam(req) {
  return req.query['include-weekends'];
}

/**
 * [getStaffCookie description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getWeekendCookie(req) {
  const namespace = keystone.get('namespace');
  return req.cookies[`${namespace}.includeWeekends`]; // || ...
}

/**
 * [getSelectedStaff description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function includeWeekends(req) {
  if (hasValidWeekendQueryParam(req)) return getWeekendQueryParam(req);
  if (hasValidWeekendCookie(req)) return getWeekendCookie(req);
  return false;
}

module.exports = includeWeekends;
