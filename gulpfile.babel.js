import request from 'request';
import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import {exec, spawn} from 'child-process-promise';
import decompress from 'gulp-decompress';
import streamify from 'gulp-streamify';
import eslint from 'gulp-eslint';
import bootlint from 'gulp-bootlint';
import htmlhint from 'gulp-htmlhint';
import run from 'gulp-run';
import yaml from 'gulp-yaml';
import vnuJar from 'vnu-jar';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import ip from 'ip';
import del from 'del';
import sortedUniq from 'lodash/sortedUniq';
import isEqual from 'lodash/isEqual';
import awspublish from 'gulp-awspublish';
import cloudfront from 'gulp-cloudfront-invalidate-aws-publish';
import promiseRetry from 'promise-retry';

const hugoVersion = '0.18';
const hugoBinary = `tmp/hugo_${hugoVersion}_linux_amd64`;
const hugoUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/hugo_${hugoVersion}_Linux-64bit.tar.gz`;
const hugoPort = 8080;

const environment = process.env.HUGO_ENV || 'development';

const printOutput = (tag, output) => {
  if (output.stdout) {
    output.stdout.split('\n').forEach((line) => {
      const tline = line.trim();
      if (tline) {
        gutil.log(gutil.colors.magenta(`${tag}: ${tline}`));
      }
    });
  }

  if (output.stderr) {
    output.stderr.split('\n').forEach((line) => {
      const tline = line.trim();
      if (tline) {
        gutil.log(gutil.colors.red(`${tag}: ${tline}`));
      }
    });
  }
};

const executeAsyncProcess = (args) => {
  let isStderrOutputPresent = false;

  return Promise.resolve().then(() => {
    if (!args.process ||
        !args.taskTag ||
        !args.processArguments ||
        args.envVars === undefined) {
      throw new Error('Invalid arguments passed into "executeAsyncProcess"');
    }

    if (!args.failOnStderr) {
      args.failOnStderr = false;
    }

    // Use spawn to execute the specified process
    const overriddenEnv = Object.assign({}, process.env, args.envVars);
    const promise = spawn(args.process, args.processArguments, {env: overriddenEnv});
    const childProcess = promise.childProcess;
    childProcess.stdout.on('data', (data) => {
      printOutput(args.taskTag, {stdout: data.toString(), stderr: ''});
    });
    childProcess.stderr.on('data', (data) => {
      isStderrOutputPresent = true;
      printOutput(args.taskTag, {stdout: '', stderr: data.toString()});
    });
    return promise;
  }).then(() => {
    if (args.failOnStderr && isStderrOutputPresent) {
      return Promise.reject('Failed due to stderr output');
    }

    return Promise.resolve();
  });
};

const waitUntilFileExists = (args) => {
  return Promise.resolve().then(() => {
    if (!args.filename || !args.taskTag || !args.retries) {
      throw new Error('Invalid arguments passed into "waitUntilFileExists"');
    }

    const doesFileExistPromise = (file) => {
      return Promise.resolve().then(() => {
        if (fs.existsSync(file)) {
          return true;
        }
        throw new Error(`File ${file} does not exist`);
      });
    };

    return promiseRetry((retry, number) => {
      const msg = `Attempting to check if "${args.filename}" exists (attempt #${number})`;
      printOutput(args.taskTag, {stdout: msg, stderr: ''});
      return doesFileExistPromise(args.filename).catch(retry);
    }, {retries: args.retries});
  });
};

const files = {
  src: ['content/**/*.*', 'themes/**/*.*', 'static/**/*.*', 'data/**/*.*'],
  dest: 'public',
  js: ['gulpfile.babel.js', 'webpack.config.js', 'assets/js/**/*.js'],
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
    'generate-version-sha',
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
  const tag = 'generate-html';

  return Promise.resolve().then(() => {
    let promises = [];

    promises.push(waitUntilFileExists({
      filename: 'data/assets.json',
      taskTag: tag,
      retries: 10,
    }));

    promises.push(waitUntilFileExists({
      filename: 'data/version.json',
      taskTag: tag,
      retries: 10,
    }));

    return Promise.all(promises);
  }).then(() => {
    let processArgs = [
      '--cleanDestinationDir',
      '--source', '.',
      '--config', './config.yaml',
      '--destination', './public',
    ];

    if (environment === "development") {
      const additionalArgs = [
        '--baseUrl', `http://${ip.address()}:${hugoPort}`,
        '--bind', '0.0.0.0',
        '--port', hugoPort,
        '--watch',
        '--quiet',
      ];

      processArgs.unshift('server');
      processArgs.push(...additionalArgs);
    }

    return executeAsyncProcess({
      process: hugoBinary,
      processArguments: processArgs,
      taskTag: tag,
      envVars: {},
    });
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
  });
});

gulp.task('new-til', ['download-hugo'], () => {
  const tag = 'new-til';
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  return Promise.resolve().then(() => {
    return executeAsyncProcess({
      process: hugoBinary,
      processArguments: [
        'new', `til/${formattedDate}-new-til.md`,
      ],
      taskTag: tag,
      envVars: {},
    });
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
  });
});

gulp.task('new-post', ['download-hugo'], () => {
  const tag = 'new-post';
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  return Promise.resolve().then(() => {
    return executeAsyncProcess({
      process: hugoBinary,
      processArguments: [
        'new', `writing/${formattedDate}-new-post.md`,
      ],
      taskTag: tag,
      envVars: {},
    });
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
  });
});

gulp.task('generate-version-sha', () => {
  const tag = 'generate-version-sha';

  return exec('git rev-parse HEAD').then(result => {
    const sha = result.stdout.trim();
    const version = {
      short: sha.substring(0,7),
      full: sha
    };
    return fs.writeFileSync('data/version.json', JSON.stringify(version));
  }).catch(err => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
  });
});

gulp.task('generate-assets', ['compile-fonts', 'download-google-analytics-js'], () => {
  const tag = 'generate-assets';

  return Promise.resolve().then(() => {
    return exec('npm bin');
  }).then((result) => {
    const yarnBinPath = result.stdout.trim();

    let processArgs = [
      '--colors',
      '--config', 'webpack.config.babel.js',
      '--output-path', './static',
    ];
    if (environment === "development") {
      processArgs.push('--watch');
    }

    return executeAsyncProcess({
      process: `${yarnBinPath}/webpack`,
      processArguments: processArgs,
      envVars: {},
      taskTag: tag,
    });
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
  });
});

gulp.task('compile-fonts', () => {
  const tag = 'compile-fonts';
  const fonts = [
    '"https://fonts.googleapis.com/css?family=Ubuntu:bold" --out=tmp/css/_ubuntu.scss',
    '"https://fonts.googleapis.com/css?family=Rancho" --out=tmp/css/_rancho.scss',
    '"https://fonts.googleapis.com/css?family=Gudea" --out=tmp/css/_gudea.scss',
    '"https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz" --out=tmp/css/_yanone_kaffeesatz.scss'
  ];

  return Promise.resolve().then(() => {
    return exec('npm bin');
  }).then((result) => {
    const yarnBinPath = result.stdout.trim();

    return Promise.all(fonts.map(entry => {
      return executeAsyncProcess({
        process: `${yarnBinPath}/webfont-dl`,
        processArguments: [
          entry,
          '--font-out=tmp/fonts/',
          '--css-rel=../../tmp/fonts',
          '--woff1=link',
          '--woff2=link',
        ],
        envVars: {},
        taskTag: tag,
      });
    }));
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
  });
});

gulp.task('download-google-analytics-js', () => {
  const googleAnalytics = 'tmp/js/google-analytics.js';
  const googleAnalyticsUrl = 'https://www.google-analytics.com/analytics.js';

  if (!fs.existsSync(googleAnalytics)) {
    return request(googleAnalyticsUrl)
      .pipe(source('google-analytics.js'))
      .pipe(gulp.dest('tmp/js'));
  }
  return;
});

gulp.task('validate-html5-content', () => {
  const tag = 'vnujar-validate-html5-content';
  return Promise.resolve().then(() => {
    return executeAsyncProcess({
      process: 'java',
      processArguments: [
        '-jar', vnuJar,
        '--skip-non-html',
        '--errors-only',
        '--exit-zero-always',
        'public/',
      ],
      taskTag: tag,
      envVars: {},
      failOnStderr: true,
    });
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
  });
});

gulp.task('analyize-html-content', () => {
  return gulp.src(files.html)
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter("htmlhint-stylish"))
    .pipe(htmlhint.failReporter({suppress: true}))
});

gulp.task('run-html-proofer', () => {
  const tag = 'run-html-proofer';
  const htmlproofer = `htmlproofer --allow-hash-href --report-script-embeds --check-html --only-4xx --url-swap "https...disjoint.ca:" --file-ignore ./public/resume/marvin-pinto-resume.html --url-ignore "/github.com\/marvinpinto\/disjoint.ca\/commit/" ./public`; // eslint-disable-line no-useless-escape

  return Promise.resolve().then(() => {
    return exec(htmlproofer);
  }).then((result) => {
    printOutput(tag, result);
    return;
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    throw new Error(`Error in task "${tag}"`);
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
  const tag = 'spellcheck';

  const mdspellArgs = [
    '--no-suggestions', '--en-us', '--ignore-numbers', '--ignore-acronyms',
    'README.md',
    'content/**/*.md',
  ];

  return Promise.resolve().then(() => {
    return exec('npm bin');
  }).then((result) => {
    const yarnBinPath = result.stdout.trim();

    return executeAsyncProcess({
      process: `${yarnBinPath}/mdspell`,
      processArguments: [
        ...mdspellArgs,
        '--report',
      ],
      envVars: {},
      taskTag: tag,
    });
  }).catch((err) => {
    printOutput(tag, {stdout: '', stderr: err.toString()});
    const msg = `Spell checker error -- run "\`npm bin\`/mdspell ${mdspellArgs.join(' ')}" and manually update the .spelling file`
    throw new Error(msg);
  });
});

gulp.task('deploy-website', () => {
  const publisher = awspublish.create({
    params: {
      Bucket: 'disjoint.ca'
    }
  });

  const headers = {
    'Cache-Control': 'max-age=315360000'
  };

  const cfSettings = {
    distribution: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    indexRootPath: true
  }

  return gulp.src(['public/**/*', 'public/**/.*', 'public/.**/*', 'public/.**/.*'])
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(cloudfront(cfSettings))
    .pipe(awspublish.reporter({
      states: ['create', 'update', 'delete']
    }));
});
