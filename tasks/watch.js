const gulp = require('gulp');

gulp.task('watch:test', () => {
  return gulp.watch(['./src/**/*.ts', './tests/**/*.spec.ts'], ['mocha']);
});


