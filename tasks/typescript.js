const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');

gulp.task('ts:dev', () => {
  const tsProject = ts.createProject('./tsconfig.json');
  const tsResult = tsProject.src()
                            // .pipe(sourcemaps.init())
                            .pipe(tsProject(ts.reporter.fullReporter(true)));

  return tsResult.js
                //  .pipe(sourcemaps.write())
                 .pipe(gulp.dest('./.tmp'));
});


gulp.task('ts:build', ['clean'], () => {
  const tsProject = ts.createProject('./tsconfig.json', {
    declaration: true,
  });

  const tsResult = tsProject.src()
                            .pipe(tsProject(ts.reporter.defaultReporter()));
  return merge([
    tsResult.js
            .pipe(gulp.dest('./lib')),
    tsResult.dts
            .pipe(gulp.dest('./lib')),
  ]);
});
