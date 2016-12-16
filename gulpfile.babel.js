import request from 'request';
import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import decompress from 'gulp-decompress';
import streamify from 'gulp-streamify';
import gls from 'gulp-live-server';
import eslint from 'gulp-eslint';
import source from 'vinyl-source-stream';
import ip from 'ip';
import {exec} from 'child_process';

const hugoVersion = '0.17';
const hugoBinary = `tmp/hugo_${hugoVersion}_linux_amd64`;
const hugoUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/hugo_${hugoVersion}_Linux-64bit.tar.gz`;

const environment = process.env.NODE_ENV || 'development';
const files = {
  dest: 'public',
  js: ['gulpfile.babel.js']
};

gulp.task('lint-javascript', () => {
  return gulp.src(files.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('all-tests', ['lint-javascript'], () => {
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

gulp.task('generate-html', ['download-hugo'], cb => {
  let hugoArgs = hugoBinary;
  if (environment === "development") {
    hugoArgs += ` --baseUrl="http://${ip.address()}"`;
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
  const port = 8080;
  const server = gls.static(files.dest, port);
  server.start();
  gutil.log(gutil.colors.yellow(`Server available at http://${ip.address()}:${port}`));

  gulp.watch([`${files.dest}/**/*.*`], event => {
    gutil.log(gutil.colors.magenta(`File ${event.path} was ${event.type}, reloading server`));
    server.notify.apply(server, [event]);
  });
});
