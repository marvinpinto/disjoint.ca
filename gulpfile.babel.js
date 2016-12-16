import request from 'request';
import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import decompress from 'gulp-decompress';
import streamify from 'gulp-streamify';
import webserver from 'gulp-webserver';
import eslint from 'gulp-eslint';
import bootlint from 'gulp-bootlint';
import source from 'vinyl-source-stream';
import ip from 'ip';
import {exec} from 'child_process';
import del from 'del';

const hugoVersion = '0.17';
const hugoBinary = `tmp/hugo_${hugoVersion}_linux_amd64`;
const hugoUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/hugo_${hugoVersion}_Linux-64bit.tar.gz`;
const hugoPort = 8080;

const environment = process.env.HUGO_ENV || 'development';
const files = {
  src: ['content/**/*.*', 'themes/**/*.*', 'static/**/*.*'],
  dest: 'public',
  js: ['gulpfile.babel.js'],
  html: 'public/**/*.html'
};

gulp.task('lint-javascript', () => {
  return gulp.src(files.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint-bootstrap', ['generate-html'], () => {
  const options = {
    stoponerror: true,
    disabledIds: [
      'E045',
      'W001',
      'W002',
      'W003',
      'W005',
      'E013',
      'E028'
    ]
  };
  return gulp.src(files.html)
    .pipe(bootlint(options))
});

gulp.task('all-tests', ['lint-javascript', 'lint-bootstrap'], () => {
  gutil.log(gutil.colors.magenta('All tests passed'));
});

gulp.task('download-hugo', () => {
  if (!fs.existsSync(hugoBinary)) {
    return request(hugoUrl)
      .pipe(source('hugo.tar.gz'))
      .pipe(streamify(decompress({strip: 1})))
      .pipe(gulp.dest('tmp'));
  }
  return;
});

gulp.task('clean-html-workspace', () => {
  return del([files.dest]);
});

gulp.task('generate-html', ['download-hugo', 'clean-html-workspace'], cb => {
  let hugoArgs = hugoBinary;
  if (environment === "development") {
    hugoArgs += ` --baseUrl="http://${ip.address()}:${hugoPort}"`;
    gulp.watch(files.src, ['generate-html']);
  }

  return exec(hugoArgs, (err, stdout, stderr) => {
    stdout.split('\n').forEach(line => {
      gutil.log(gutil.colors.magenta(line));
    });
    stderr.split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    cb(err);
  });
});

gulp.task('development-server', ['generate-html'], () => {
  const options = {
    livereload: true,
    host: ip.address(),
    port: hugoPort,
  };
  gulp.src(files.dest).pipe(webserver(options));
});
