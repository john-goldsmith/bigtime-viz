const homeController = require('./home')
const employeeCountController = require('./employee-count')
const ganttController = require('./gantt')
const percentageController = require('./percentage')
const totalHoursAllPeopleController = require('./total-hours-all-people')
const totalHoursAllProjectsController = require('./total-hours-all-projects')
const totalHoursByProjectController = require('./total-hours-by-project')
const totalHoursCompanyController = require('./total-hours-company')

module.exports = {
  homeController,
  employeeCountController,
  ganttController,
  percentageController,
  totalHoursAllPeopleController,
  totalHoursAllProjectsController,
  totalHoursByProjectController,
  totalHoursCompanyController
}
