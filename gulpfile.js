var gulp = require('gulp'),
  notify = require('gulp-notify'),
  babel = require('gulp-babel'),
  flow = require('gulp-flowtype'),
  sourcemaps = require('gulp-sourcemaps'),
  sourcemapReporter = require('jshint-sourcemap-reporter');

const srcDir = "src";
const flowDest = "build";

gulp.task('flow:babel', function(cb) {
  gulp.src(srcDir + '/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [['es2015', { modules: 'commonjs' }]],
      plugins: [
        "syntax-flow",
        "transform-flow-strip-types",
      ],
    }))
    .on('error', notify.onError('<%= error.message %>'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(flowDest))
    .on('end', cb);
});

gulp.task('flow', ['flow:babel'], function() {
  gulp.src(flowDest + '/**/*.js')
    .pipe(flow({
      all: false,
      weak: false,
      killFlow: false,
      beep: true,
      abort: false,
      reporter: {
        reporter: function(errors) {
          return sourcemapReporter.reporter(errors, { sourceRoot: '/' + srcDir + '/' });
        }
      }
    }));
});

gulp.task('flow:watch', ['flow'], function() {
  gulp.watch(srcDir + '/**/*.js', ['flow']);
});

gulp.task('default', ['flow']);
