var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var imagemin = require('gulp-imagemin');
var minifyCss = require('gulp-minify-css');
var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var rigger = require('gulp-rigger');
var rimraf = require('gulp-rimraf');

var fontName = "fontName";

gulp.task('webserver', function () {
    browserSync({
        server: {
            baseDir: "./build"
        },
        host: 'localhost',
        port: 3000,
        tunnel: true
    })
});

gulp.task('build', [
    'scss',
    'html',
    'img',
    'js',
    'svgFont'

]);

gulp.task('clean', function () {
    return gulp.src('./build', {read: false})
        .pipe(rimraf());
});

gulp.task('fonts', function () {
    return gulp.src('./source/fonts/*')
        .pipe(gulp.dest('./build/fonts/'))
});

gulp.task('svgFont', function () {
    return gulp.src('./source/img/icon/*.svg')
        .pipe(iconfontCss({
            path: './source/scss/templates/_icons_template.scss',
            fontName: fontName,
            targetPath: '../../source/scss/icon/_icons.scss'
        }))
        .pipe(iconfont({
            fontName: fontName
        }))
        .pipe(gulp.dest('build/fonts/'));

});

gulp.task('html', function () {
    return gulp.src('./source/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('./build/'))
        .pipe(reload({stream: true }));
});

gulp.task('js', function () {
    return gulp.src('./source/js/*.*')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        .pipe(sourcemaps.write())
        .pipe(reload({stream: true }));
});

gulp.task('img', function () {
    return gulp.src('./source/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img/'))
        .pipe(reload({stream: true }));
});

gulp.task('scss', function () {
    return gulp.src('./source/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'))
        .pipe(reload({stream: true }));
});

gulp.task('watch', ['scss', 'html', 'img', 'js', 'fonts', 'svgFont'], function() {
    gulp.watch('source/scss/*', ['scss']);
    gulp.watch('source/*.*', ['html']);
    gulp.watch('source/img/*.*', ['img']);
    gulp.watch('source/js/*.*', ['js']);
    gulp.watch('source/fonts/*', ['fonts']);
    gulp.watch('source/img/icon/*.svg', ['svgFont']);
});

gulp.task('default', ['clean', 'build', 'webserver', 'watch']);
