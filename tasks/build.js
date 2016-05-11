'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');


gulp.task('build', (cb) => {
  return runSequence('ts:build', 'clean:test', cb);
});
