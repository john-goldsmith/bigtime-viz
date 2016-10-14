var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

  // req.flash('success', 'Cool');

	// Render the view
	view.render('foo');
};
