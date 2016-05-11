const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => {
  return del(['.tmp/', './lib/']);
});

gulp.task('clean:test', () => {
  return del(['./lib/tests/']);
});
