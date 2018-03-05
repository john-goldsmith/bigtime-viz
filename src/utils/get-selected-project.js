const namespace = require('../config/namespace')

/**
 * [isValidStaff description]
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
function isValidProject(value) {
  return !Number.isNaN(Number.parseInt(value, 10))
}

/**
 * [hasValidStaffCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidProjectCookie(req) {
  return hasProjectCookie(req) ? isValidProject(getProjectCookie(req)) : false;
}

/**
 * [hasValidStaffQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasValidProjectQueryParam(req) {
  return hasProjectQueryParam(req) ? isValidProject(getProjectQueryParam(req)) : false;
}

/**
 * [hasStaffQueryParam description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasProjectQueryParam(req) {
  return req.query && req.query.project;
}

/**
 * [hasStaffCookie description]
 * @param  {[type]}  req [description]
 * @return {Boolean}     [description]
 */
function hasProjectCookie(req) {
  // const namespace = namespace;
  return req.cookies && req.cookies[`${namespace}.lastSelectedProject`];
}

/**
 * [getStaffQueryParam description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getProjectQueryParam(req) {
  return req.query.project;
}

/**
 * [getStaffCookie description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getStaffProject(req) {
  // const namespace = namespace;
  return req.cookies[`${namespace}.lastSelectedProject`]; // || ...
}

/**
 * [getSelectedStaff description]
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function getSelectedProject(req) {
  if (hasValidProjectQueryParam(req)) return getProjectQueryParam(req);
  if (hasValidProjectCookie(req)) return getProjectCookie(req);
  throw new Error('Error getting selected project');
}

module.exports = getSelectedProject;
