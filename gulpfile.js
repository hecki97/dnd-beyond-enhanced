const {
  src, dest, parallel, watch, task, series,
} = require('gulp');

const sass = require('gulp-sass');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

function include3rdPartyLibs() {
  return src('./node_modules/github-markdown-css/github-markdown.css')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(src('./node_modules/marked/marked.min.js'))
    .pipe(dest('dist/'));
}

function minifyJS() {
  return src('src/*.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('dist/'));
}

function copyJS() {
  return src('src/*.js')
    .pipe(dest('dist/'));
}

function transpileCSS() {
  return src('src/*.scss')
    .pipe(sass())
    .pipe(dest('dist/'));
}

task('sass:watch', () => {
  watch('src/*.scss', transpileCSS);
});

task('js:watch', () => {
  watch('src/*.js', copyJS);
});

exports.watch = parallel('sass:watch', 'js:watch');
exports.dev = series(include3rdPartyLibs, parallel(copyJS, transpileCSS), this.watch);
exports.build = series(include3rdPartyLibs, parallel(minifyJS, transpileCSS));
