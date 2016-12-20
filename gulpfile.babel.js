import request from 'request';
import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import decompress from 'gulp-decompress';
import streamify from 'gulp-streamify';
import webserver from 'gulp-webserver';
import eslint from 'gulp-eslint';
import bootlint from 'gulp-bootlint';
import htmlhint from 'gulp-htmlhint';
import gulpif from 'gulp-if';
import run from 'gulp-run';
import yaml from 'gulp-yaml';
import vnuJar from 'vnu-jar';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import ip from 'ip';
import {exec} from 'child-process-promise';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import del from 'del';
import sortedUniq from 'lodash/sortedUniq';
import isEqual from 'lodash/isEqual';

const hugoVersion = '0.17';
const hugoBinary = `tmp/hugo_${hugoVersion}_linux_amd64`;
const hugoUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/hugo_${hugoVersion}_Linux-64bit.tar.gz`;
const hugoPort = 8080;

const environment = process.env.HUGO_ENV || 'development';
const files = {
  src: ['content/**/*.*', 'themes/**/*.*', 'static/**/*.*', 'data/**/*.*'],
  dest: 'public',
  js: ['gulpfile.babel.js', 'webpack.config.js'],
  html: 'public/**/*.html',
  assets: ['assets/css/**/*.*', 'assets/js/**/*.*', 'assets/images/**/*.*']
};

gulp.task('lint-javascript', () => {
  return gulp.src(files.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint-bootstrap', () => {
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

gulp.task('all-tests', (cb) => {
  runSequence(
    'generate-assets',
    'generate-html',
    ['lint-javascript', 'lint-bootstrap', 'analyize-html-content', 'validate-html5-content', 'run-html-proofer', 'spellcheck'],
    cb);
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

gulp.task('generate-html', ['download-hugo'], () => {
  let hugoArgs = hugoBinary;
  if (environment === "development") {
    hugoArgs += ` --baseUrl="http://${ip.address()}:${hugoPort}"`;
    gulp.watch(files.src, ['generate-html']);
  }

  return exec(hugoArgs).then(result => {
    result.stdout.split('\n').forEach(line => {
      gutil.log(gutil.colors.magenta(line));
    });
    result.stderr.split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    return;
  }).catch(err => {
    err.toString().split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    throw new Error("Error in task 'generate-html'");
  });
});

gulp.task('generate-assets', ['compile-fonts'], () => {
  let options = require('./webpack.config.js');

  const printStats = (err, stats) => {
    stats.toString().split('\n').forEach(line => {
      gutil.log(gutil.colors.magenta(line));
    });
    if (err) {
      err.toString().split('\n').forEach(line => {
        gutil.log(gutil.colors.red(line));
      });
    }
  }

  if (environment === "development") {
    gulp.watch(files.assets, ['generate-assets']);
  }

  return gulp.src('assets/js/main.js')
    .pipe(gulpWebpack(options, webpack, printStats))
    .pipe(gulpif(['*.js', '*.css' ], gulp.dest('static/assets')))
    .pipe(gulpif(['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2'], gulp.dest('static/assets')))
    .pipe(gulpif(['*.gif', '*.png', '*.jpg', '*.jpeg', '*.svg'], gulp.dest('static/assets')))
    .pipe(gulpif('*.json', gulp.dest('data')));
});

gulp.task('compile-fonts', () => {
  const commonArgs = '--font-out=tmp/fonts/ --css-rel=../fonts --woff1=link --woff2=link';
  const fonts = [
    '"https://fonts.googleapis.com/css?family=Ubuntu:bold" --out=tmp/css/_ubuntu.scss',
    '"https://fonts.googleapis.com/css?family=Rancho" --out=tmp/css/_rancho.scss',
    '"https://fonts.googleapis.com/css?family=Gudea" --out=tmp/css/_gudea.scss',
    '"https://fonts.googleapis.com/css?family=Oswald" --out=tmp/css/_oswald.scss'
  ];

  return exec('npm bin').then(result => {
    return result.stdout.trim();
  }).then(npmBinPath => {
    return Promise.all(fonts.map(entry => {
      return exec(`${npmBinPath}/webfont-dl ${entry} ${commonArgs}`);
    }));
  }).catch(err => {
    err.toString().split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    throw new Error("Error in task 'compile-fonts'");
  });
});

gulp.task('validate-html5-content', () => {
  const vnuCmd = `java -jar ${vnuJar} --skip-non-html --errors-only public/`;

  return exec(vnuCmd).then(result => {
    result.stdout.split('\n').forEach(line => {
      gutil.log(gutil.colors.magenta(line));
    });
    result.stderr.split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });

    if (result.stderr) {
      throw new Error("Error in task 'lint-html-content'");
    }
    return;
  }).catch(err => {
    err.toString().split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    throw new Error("Error in task 'lint-html-content'");
  });
});

gulp.task('analyize-html-content', () => {
  return gulp.src(files.html)
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter("htmlhint-stylish"))
    .pipe(htmlhint.failReporter({suppress: true}))
});

gulp.task('run-html-proofer', () => {
  const htmlproofer = `htmlproofer --allow-hash-href --report-script-embeds --check-html --only-4xx --url-swap "https...disjoint.ca:" --file-ignore ./public/resume/marvin-pinto-resume.html ./public`;

  return exec(htmlproofer).then(result => {
    result.stdout.split('\n').forEach(line => {
      gutil.log(gutil.colors.magenta(line));
    });
    result.stderr.split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });

    if (result.stderr) {
      throw new Error("Error in task 'run-html-proofer'");
    }
    return;
  }).catch(err => {
    err.toString().split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    throw new Error("Error in task 'run-html-proofer'");
  });
});

gulp.task('generate-hackmyresume', () => {
  let hackmyresume = 'hackmyresume BUILD tmp/resume/resume.json TO ';
  hackmyresume += 'static/resume/marvin-pinto-resume.pdf ';
  hackmyresume += 'static/resume/marvin-pinto-resume.html ';
  hackmyresume += 'static/resume/marvin-pinto-resume.txt ';
  hackmyresume += '-t positive --pdf wkhtmltopdf';

  return gulp.src('resume.yaml')
    .pipe(yaml({space: 2}))
    .pipe(gulp.dest('tmp/resume/'))
    .pipe(run(hackmyresume).exec())
});

gulp.task('create-resume', ['generate-hackmyresume'], () => {
  return del(['static/resume/*.pdf.html', 'static/resume/*.css']);
});

gulp.task('format-spellcheck-file', (cb) => {
  let original = [];
  let modified = [];

  const spellingFile = fs.readFileSync('.spelling', "utf-8");
  spellingFile.split('\n').forEach(line => {
    if (!line) {
      return;
    }
    original.push(line);
    if (!line.startsWith("#") && !line.startsWith(" -")) {
      modified.push(line);
    }
  });
  modified = sortedUniq(modified.sort());

  const msg = 'Run "`npm bin`/gulp format-spellcheck-file" to re-format the .spelling file';
  if (environment === "development") {
    fs.writeFileSync('.spelling', modified.join('\n'), 'utf-8');
    cb();
    return;
  } else if (!isEqual(original, modified)) {
    cb(msg);
    return;
  }
  cb();
});

gulp.task('spellcheck', ['format-spellcheck-file'], () => {
  let mdspell = "mdspell --no-suggestions --en-us --ignore-numbers --ignore-acronyms ";
  mdspell += "'README.md' ";
  mdspell += "'content/**/*.md'";

  return exec('npm bin').then(result => {
    return result.stdout.trim();
  }).then(npmBinPath => {
    return exec(`${npmBinPath}/${mdspell} --report`);
  }).then(result => {
    result.stdout.split('\n').forEach(line => {
      gutil.log(gutil.colors.magenta(line));
    });
    result.stderr.split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    return;
  }).catch(err => {
    err.toString().split('\n').forEach(line => {
      gutil.log(gutil.colors.red(line));
    });
    const msg = `Spell checker error -- run "\`npm bin\`/${mdspell}" and manually update the .spelling file`
    throw new Error(msg);
  });
});

gulp.task('development-server', () => {
  runSequence('generate-assets', 'generate-html', () => {
    const options = {
      livereload: true,
      host: ip.address(),
      port: hugoPort,
    };
    gulp.src(files.dest).pipe(webserver(options));
  });
});
