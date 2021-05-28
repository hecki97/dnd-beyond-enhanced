const { src, dest, series, parallel } = require('gulp');
const rename = require('gulp-rename');

function copyExternalLibs() {
  return src('./node_modules/marked/marked.min.js').pipe(
    src('./node_modules/github-markdown-css/github-markdown.css'),
    dest('dist/'),
  );
}

function copyLocalFiles() {
  return src('./src/*').pipe(
    dest('dist/'),
  );
}

exports.default = parallel(copyExternalLibs, copyLocalFiles);
