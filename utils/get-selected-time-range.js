const keystone = require('keystone');

/**
 * [isValidTimeRange description]
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
function isValidTimeRange(value) {
  const timeRanges = keystone.get('timeRanges');
  return timeRanges.map(timeRange => timeRange.value).includes(value);
}

/**
 * [hasValidTimeRangeCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidTimeRangeCookie(req) {
  return hasTimeRangeCookie(req) ? isValidTimeRange(getTimeRangeCookie(req)) : false;
}

/**
 * [hasValidTimeRangeQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidTimeRangeQueryParam(req) {
  return hasTimeRangeQueryParam(req) ? isValidTimeRange(getTimeRangeQueryParam(req)) : false;
}

/**
 * [getDefaultTimeRange description]
 * @return {[type]} [description]
 */
function getDefaultTimeRange() {
  return keystone.get('defaultTimeRange').value || '1M';
}

/**
 * [hasTimeRangeQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasTimeRangeQueryParam(req) {
  return req.query && req.query['time-range'];
}

/**
 * [hasTimeRangeCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasTimeRangeCookie(req) {
  const namespace = keystone.get('namespace');
  return req.cookies && req.cookies[`${namespace}.lastSelectedTimeRange`];
}

/**
 * [getTimeRangeQueryParam description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getTimeRangeQueryParam(req) {
  return req.query['time-range']; // || ...
}

/**
 * [getTimeRangeCookie description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getTimeRangeCookie(req) {
  const namespace = keystone.get('namespace');
  return req.cookies[`${namespace}.lastSelectedTimeRange`]; // || ...
}

/**
 * [getSelectedTimeRange description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getSelectedTimeRange(req) {
  if (hasValidTimeRangeQueryParam(req)) return getTimeRangeQueryParam(req);
  if (hasValidTimeRangeCookie(req)) return getTimeRangeCookie(req);
  return getDefaultTimeRange();
}

module.exports = getSelectedTimeRange;
