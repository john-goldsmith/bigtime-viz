const keystone = require('keystone');

/**
 * [isValidStaff description]
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
function isValidStaff(value) {
  return !Number.isNaN(Number.parseInt(value, 10))
}

/**
 * [hasValidStaffCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidStaffCookie(req) {
  return hasStaffCookie(req) ? isValidStaff(getStaffCookie(req)) : false;
}

/**
 * [hasValidStaffQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidStaffQueryParam(req) {
  return hasStaffQueryParam(req) ? isValidStaff(getStaffQueryParam(req)) : false;
}

/**
 * [hasStaffQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasStaffQueryParam(req) {
  return req.query && req.query.staff;
}

/**
 * [hasStaffCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasStaffCookie(req) {
  const namespace = keystone.get('namespace');
  return req.cookies && req.cookies[`${namespace}.lastSelectedStaff`];
}

/**
 * [getStaffQueryParam description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getStaffQueryParam(req) {
  return req.query.staff;
}

/**
 * [getStaffCookie description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getStaffCookie(req) {
  const namespace = keystone.get('namespace');
  return req.cookies[`${namespace}.lastSelectedStaff`]; // || ...
}

/**
 * [getSelectedStaff description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getSelectedStaff(req) {
  if (hasValidStaffQueryParam(req)) return getStaffQueryParam(req);
  if (hasValidStaffCookie(req)) return getStaffCookie(req);
  throw new Error('Error getting selected staff');
}

module.exports = getSelectedStaff;
