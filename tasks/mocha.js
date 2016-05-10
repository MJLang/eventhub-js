const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('mocha', ['ts:dev'], () => {
  return gulp.src('./.tmp/tests/**/*.*', { read: false })
             .pipe(mocha());
});
