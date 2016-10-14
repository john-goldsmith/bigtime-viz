const gulp = require('gulp'),
      watch = require('gulp-watch'),
      shell = require('gulp-shell'),
      sass = require('gulp-sass'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      vinylSourceStream = require('vinyl-source-stream'),
      paths = {
      	src: [
          './models/**/*.js',
          './routes/**/*.js',
          'keystone.js',
          'package.json'
        ],
      	style: {
      		all: './public/styles/**/*.{sass,scss}',
      		output: './public/styles/'
      	},
        script: {
          all: './public/js/index.js',
          output: './public/js/'
        }
      };

gulp.task('watch:sass', () => {
	gulp.watch(paths.style.all, ['sass']);
});

gulp.task('watch:js', () => {
  gulp.watch(paths.script.all, ['browserify']);
});

gulp.task('browserify', () => {
  return browserify(paths.script.all, {debug: true})
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .pipe(vinylSourceStream('application.js'))
    .pipe(gulp.dest(paths.script.output));
});

gulp.task('sass', () => {
	gulp.src(paths.style.all)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(paths.style.output));
});

gulp.task('runKeystone', shell.task('node keystone.js'));

gulp.task('watch', [
  'watch:sass',
  'watch:js'
]);

gulp.task('default', ['sass', 'browserify', 'watch', 'runKeystone']);
