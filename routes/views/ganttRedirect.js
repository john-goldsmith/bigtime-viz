const keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
  
  locals.bigTime.getStaffList()
    .then(
      response => {
        res.redirect(`/gantt/${response.body[0].StaffSID}`);
      },
      () => {
        console.log('Error fetching staff list.');
        view.render('index');
      }
    );

};
