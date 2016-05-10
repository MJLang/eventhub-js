const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('ts:dev', () => {
  const tsProject = ts.createProject('./tsconfig.json');
  const tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(ts(tsProject));

  return tsResult.js
                 .pipe(sourcemaps.write())
                 .pipe(gulp.dest('./.tmp'));

});
