const gulp = require('gulp');
const ts = require('gulp-typescript');
const flatten = require('gulp-flatten');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');

gulp.task('ts:dev', () => {
  const tsProject = ts.createProject('./tsconfig.json');
  const tsResult = tsProject.src()
                            .pipe(sourcemaps.init())
                            .pipe(ts(tsProject));

  return tsResult.js
                 .pipe(sourcemaps.write())
                 .pipe(gulp.dest('./.tmp'));

});


gulp.task('ts:build', ['clean'], () => {
  const tsProject = ts.createProject('./tsconfig.json', {
    declaration: true,
  });

  const tsResult = tsProject.src()
                            .pipe(ts(tsProject));
  return merge([
    tsResult.js
            .pipe(gulp.dest((file) => {
              file.path = file.path.replace('src', '');
              return './lib';
            })),
    tsResult.dts
            .pipe(gulp.dest((file) => {
              file.path = file.path.replace('src', '');
              return './lib';
            })),
    ]);
});
