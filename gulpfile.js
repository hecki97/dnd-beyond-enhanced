const {
  src, dest, parallel, watch, task, series,
} = require('gulp');

const sass = require('gulp-sass');
const clean = require('gulp-clean');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');

const config = require('./webpack.config');

function include3rdPartyLibs() {
  return src('./node_modules/github-markdown-css/github-markdown.css')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(src('./node_modules/marked/marked.min.js'))
    .pipe(dest('dist/'));
}

function copyManifest() {
  return src('src/manifest.json')
    .pipe(dest('dist/'));
}

function transpileTS() {
  return src('./src/script.ts')
    .pipe(gulpWebpack(config, webpack))
    .pipe(dest('dist/'));
}

function transpileAndCompressTS() {
  return src('./src/script.ts')
    .pipe(gulpWebpack({
      ...config,
      mode: 'production',
      watch: false,
    }, webpack))
    .pipe(dest('dist/'));
}

function transpileCSS() {
  return src('src/*.scss')
    .pipe(sass())
    .pipe(dest('dist/'));
}

function transpileAndCompressCSS() {
  return src('src/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(dest('dist/'));
}

function cleanDist() {
  return src('dist/*')
    .pipe(clean());
}

task('sass:watch', () => {
  watch('src/**/*.scss', transpileCSS);
});

task('ts:watch', () => {
  watch('src/**/*.ts', transpileTS);
});

exports.watch = parallel('sass:watch', 'ts:watch');
exports.dev = series(
  cleanDist,
  parallel(include3rdPartyLibs, copyManifest, transpileTS, transpileCSS),
  this.watch,
);

exports.build = series(
  cleanDist,
  parallel(include3rdPartyLibs, copyManifest, transpileAndCompressTS, transpileAndCompressCSS),
);
