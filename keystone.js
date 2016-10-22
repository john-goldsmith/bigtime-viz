// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

const BigTime = require('bigtime-sdk'),
      bigTime = new BigTime({
        username: process.env.BIGTIME_USERNAME,
        password: process.env.BIGTIME_PASSWORD
      });

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'BigTime Viz',
	'brand': 'Verys',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',
  'view cache': false,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: 'users',
});

/**
 * It probably isn't the best to create a BigTime session when the Keystone
 * app initially boots (especially in a production environment), but it's
 * good enough for development purposes.
 */
bigTime.createSession()
  .then(
    () => {
      keystone.set('bigTime', bigTime);
      // Start Keystone to connect to your database and initialise the web server
      keystone.start()
    },
    () => {
      console.log('Error creating BigTime session.');
      process.exit(1);
    }
  );
