require('dotenv').config();

const keystone = require('keystone'),
      BigTime = require('bigtime-sdk'),
      bigTime = new BigTime({
        username: process.env.BIGTIME_USERNAME,
        password: process.env.BIGTIME_PASSWORD
      }),
      timeRanges = [
        {
          key: '1 week',
          value: '1w',
          disabled: false
        },
        {
          key: '1 month',
          value: '1M',
          disabled: false
        },
        {
          key: '3 months',
          value: '3M',
          disabled: false
        },
        {
          key: '6 months',
          value: '6M',
          disabled: false
        },
        {
          key: '1 year',
          value: '1y',
          disabled: false
        },
        {
          key: 'Max',
          value: 'max',
          disabled: false
        },
        {
          key: 'Custom',
          value: 'custom',
          disabled: true
        }
      ];

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
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User'
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
	editable: keystone.content.editable
  // timeRanges
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	users: 'users',
});

keystone.set('namespace', 'bigTimeViz');

keystone.set('timeRanges', timeRanges);
  
keystone.set('defaultTimeRange', timeRanges.find(timeRange => timeRange.value === '1M'));

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
