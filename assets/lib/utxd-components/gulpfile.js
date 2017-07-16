// Pipeline
const gulp = require('gulp');
const clean = require('gulp-clean');
const inject = require('gulp-inject');
const svgSprite = require('gulp-svg-sprite');

// CSS
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const pxtorem = require('gulp-pxtorem');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');

// JS
const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const uglify = require('rollup-plugin-uglify');
const vue = require('rollup-plugin-vue');

const nodeEnv = process.env.NODE_ENV === 'production' ?
    JSON.stringify('production') : JSON.stringify('develop');

const paths = {
  js: {
    src: './src/js/utxd-components.js',
    styles: './src/js/**/*.scss',
    dest: './dist/js'
  },
  svg: {
    src: './src/svg/**/*.svg',
    dest: './dist/svg/'
  },
  styles: {
    src: './src/sass/**/*.scss',
    dest: './dist/css/'
  }
}

const rollupPlugins = [
  eslint(),
  vue({
    compileTemplate: true,
    css: true
  }),
  replace({
    'process.env.NODE_ENV': nodeEnv,
    'process.env.VUE_ENV': JSON.stringify('browser')
  }),
  buble(),
  commonjs(),
  resolve({
    jsnext: true,
    main: true,
    browser: true
  })
];

if (process.env.NODE_ENV === 'production') {
  rollupPlugins.push(uglify());
}

const sassLintRules = {
  'class-name-format': [2, {convention: 'hyphenatedbem'}]
};

gulp.task('clean-js', () => {
  return gulp.src(paths.js.dest, {read: false})
    .pipe(clean());
});

gulp.task('clean-styles', () => {
  return gulp.src(paths.styles.dest, {read: false})
    .pipe(clean());
});

gulp.task('clean-svg', () => {
  return gulp.src(paths.svg.dest, {read: false})
    .pipe(clean());
});

gulp.task('js', ['clean-js', 'lint-vue-sass'], function() {
  return rollup({
    entry: paths.js.src,
    format: 'iife',
    plugins: rollupPlugins
  })
  .pipe(source('utxd-components.js'))
  .pipe(gulp.dest(paths.js.dest))
  .on('error', e => {
    console.error(`${e.stack}`);
  });
});

gulp.task('lint-vue-sass', () => {
  return gulp
    .src(paths.js.styles)
    .pipe(sassLint({
      rules: sassLintRules
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass().on('error', sass.logError));
});

gulp.task('sass', ['clean-styles'], () => {
  return gulp
    .src(paths.styles.src)
    .pipe(sassLint({
      files: {
        ignore: [
          'src/sass/foundations/typography/_fonts.scss',
          'src/sass/global/_normalize.scss'
        ]
      },
      rules: sassLintRules
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass().on('error', sass.logError))
    .pipe(pxtorem({
      propWhiteList: [],
      mediaQuery: true
    }))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('svg', ['clean-svg'], function () {
  return gulp.src(paths.svg.src)
    .pipe(svgSprite({
      mode: {
        defs: {
          dest: '.',
          prefix: '',
          sprite: 'utxd-sprite.svg'
        }
      },
      svg: {
        dimensionAttributes: false
      },
    }))
    .pipe(gulp.dest(paths.svg.dest));
});

gulp.task('watch', () => {
  gulp.watch('./src/js/**/*', ['js']);
  gulp.watch(paths.styles.src, ['sass']);
});

gulp.task('default', ['js', 'sass', 'svg'], () => {
  return gulp
    .src('./examples/**/*.html')
    .pipe(inject(gulp.src(['./dist/svg/utxd-sprite.svg']), {
      starttag: '<!-- inject:svg -->',
      transform: function (filePath, file) {
        return file.contents.toString('utf8')
      }
    }))
    .pipe(gulp.dest('./examples'));
});
