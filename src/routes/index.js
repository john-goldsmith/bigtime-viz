const express = require('express')
const middleware = require('../middleware')
const {
  homeController,
  ganttController,
  percentageController,
  totalHoursCompanyController,
  totalHoursAllProjectsController,
  totalHoursAllPeopleController,
  totalHoursByProjectController,
  employeeCountController
} = require('../controllers')

const router = express.Router()

router.get('/', homeController.index)
      .get('/gantt', ganttController.index)
      .get('/percentage', percentageController.index)
      .get('/total-hours-company', totalHoursCompanyController.index)
      .get('/total-hours-all-projects', totalHoursAllProjectsController.index)
      .get('/total-hours-all-people', totalHoursAllPeopleController.index)
      .get('/total-hours-by-project', totalHoursByProjectController.index)
      .get('/employee-count', employeeCountController.index)

module.exports = router
