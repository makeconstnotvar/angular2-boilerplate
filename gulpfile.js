var gulp = require('gulp'),
    del = require('del'),
    series = require('gulp-series'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    gif = require('gulp-if');


gulp.task('debug:clean', function () {
    return del('build/debug/**/*');
});
gulp.task('debug:html', function () {
    return gulp
        .src(['application/**/*.html',
        '!application/index.html'])
        .pipe(gulp.dest('build/debug/app'))
});
gulp.task('debug:sass', function () {
    return gulp
        .src(['application/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/debug'))
});
gulp.task('debug:inject', ['debug:html', 'debug:sass'], function () {
    let libs = gulp.src([
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.src.js',
        'config.js',
        'build/debug/**/*.css'
    ], {read: false});

    return gulp
        .src('application/index.html')
        .pipe(inject(libs))
        .pipe(gulp.dest('.'));
});


gulp.task('release:clean', function () {
    return del([
        'build/compiled/**/*',
        'build/converted/**/*',
        'build/temp/**/*',
        'build/release/**/*',
        '!build/compiled/main-release.ts',
        '!build/release/js'
    ]);
});
gulp.task('release:precompile', function () {
    return gulp.src([
        'application/{components,modules}/**/*.{html,ts}',
        'application/main.ts'])
        .pipe(gulp.dest('build/compiled'))
});
gulp.task('release:libs', function () {
    return gulp.src([
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js'])
        .pipe(gif('**/Reflect.js', rename({basename: 'reflect'})))
        .pipe(uglify())
        .pipe(gulp.dest('build/release/js'));
});
gulp.task('release:move', function () {
    return gulp.src([
        //'build/release/scripts.js',
        'application/module.js'])
        .pipe(gulp.dest('build/release/js'));
});
gulp.task('release:sass', function () {
    gulp.src('application/css/**/*.scss')
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('build/release/css'))
});
gulp.task('release:inject', ['release:libs', 'release:move', 'release:sass'], function () {
    let files = gulp.src([
        'build/release/js/module.js',
        'build/release/js/reflect.js',
        'build/release/js/zone.js',
        'build/release/js/scripts.js',
        'build/release/css/styles.css'
    ], {read: false});

    return gulp.src('application/index.html')
        .pipe(inject(files, {ignorePath: '/build/release/'}))
        .pipe(gulp.dest('build/release'));
});