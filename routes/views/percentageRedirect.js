const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	let locals = res.locals;
  
  locals.bigTime.getStaffList()
    .then(
      response => {
        res.redirect(`/percentage/${response.body[0].StaffSID}`);
      },
      () => {
        console.log('Error fetching staff list.');
        view.render('index');
      }
    );

};
