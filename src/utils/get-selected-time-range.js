// const app = require('../config/express')
const { timeRanges, defaultTimeRange } = require('../config/time-ranges')
const namespace = require('../config/namespace')

/**
 * [isValidTimeRange description]
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
function isValidTimeRange(value) {
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
  return defaultTimeRange.value
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
  // const namespace = namespace;
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
  // const namespace = namespace;
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
