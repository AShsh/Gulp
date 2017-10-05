/*
 *
 * переменные  задач
 *
 */
 var gulp = require('gulp'),                              // Gulp
   sass = require('gulp-sass'),                           // Конверстация SASS (SCSS) в CSS
   uglify = require('gulp-uglify'),                       // Минификация JS
   mincss = require('gulp-csso'),                         // Минификация CSS
   csscomb = require('gulp-csscomb'),                     // Форматирование CSS
   autoprefixer = require('gulp-autoprefixer'),           // Автопрефиксер
   groupmq = require('gulp-group-css-media-queries'),     // Группирование медиазапросов
   minimage = require('gulp-imagemin'),                   // Минификация изображений
   concat = require('gulp-concat'),                       // Склейка файлов
   rigger = require('gulp-rigger'),                       // Инклюд
   rename = require('gulp-rename'),                       // переименвоание файлов
   sourcemaps = require('gulp-sourcemaps'),               // sourcemaps
   imagemin = require('gulp-imagemin'),                   // минимизация изображений
   rimraf = require("gulp-rimraf"),                       // удаление файло
   svgSprite = require('gulp-svg-sprite'),                // создание спрайта
   svgmin = require('gulp-svgmin'),                       // минификация SVG
   cheerio = require('gulp-cheerio');                     // удаление лишних атрибутов из svg


/*
 *
 * переменные для путей
 *
 */

var files = {
  source: {
      html: 'source/*.html',
     style: 'source/scss/main.scss',
     scss: 'source/scss/*',
        js: 'source/js/*.js',
       img: 'source/img/sprite/*.*',
       svg: 'source/img/sprite/*.svg',
       png: 'source/img/sprite/*.png'
  },
  build: {
      html: 'build/',
       css: 'build/css/',
        js: 'build/js/',
       img: 'build/img/'
  },
  watch: {
      html: ['source/*.html', 'source/include/*.html'],
     style: 'source/scss/*',
        js: 'source/js/*.js',
       img: 'source/img/*'
  },
};


/*
 *
 * Таски
 *
 */

// Sass
  gulp.task('sass', function () {
     return gulp.src(files.source.style)
     .pipe(sourcemaps.init())
     .pipe(sass())
     .pipe(csscomb())

     .pipe(autoprefixer())
     .pipe(groupmq())
     .pipe(sourcemaps.write())
     .pipe(gulp.dest(files.build.css))

     .pipe(mincss())
     .pipe(rename({suffix: ".min"}))

     .pipe(gulp.dest(files.build.css))
  });


// HTML
gulp.task('html', function () {
    gulp.src(files.source.html)
        .pipe(rigger())
        .pipe(gulp.dest(files.build.html))
});


// JS
gulp.task('js', function () {
    gulp.src(files.source.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(files.build.js))

        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(files.build.js))
});

gulp.task('watch', function () {
  gulp.watch(files.watch.html, ['html']);
  gulp.watch(files.watch.style, ['sass']);
});


gulp.task('build', [
    'html',
    'sass',
    'js'
]);

gulp.task('clean', function() {
 return gulp.src('./build/*')
   .pipe(rimraf());
});
