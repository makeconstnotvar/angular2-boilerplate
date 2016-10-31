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
    gif = require('gulp-if'),
    configTsc = require('./tsconfig-debug.json');
//config = require('./tsconfig.json');

gulp.task('debug:clean', function () {
    return del('build/debug/**/*');
});
gulp.task('debug:html', function () {
    return gulp
        .src(['application/**/*.html',
        '!application/index.html'])
        .pipe(gulp.dest('build/debug/app'))
});
gulp.task('debug:move', function () {
    return gulp
        .src(['application/system.config.js'])
        .pipe(gulp.dest('build/debug'))
});
gulp.task('debug:sass', function () {
    return gulp
        .src(['application/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/debug'))
});
gulp.task('debug:libs', function () {
    return gulp
        .src([
            'core-js/client/shim.min.js',
            'zone.js/dist/zone.js',
            'reflect-metadata/Reflect.js',
            'rxjs/bundles/Rx.js',
            '@angular/forms/bundles/forms.umd.js',
            '@angular/http/bundles/http.umd.js',
            '@angular/router/bundles/router.umd.js',
            '@angular/core/bundles/core.umd.js',
            '@angular/common/bundles/common.umd.js',
            '@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            'systemjs/dist/system-polyfills.js',
            'systemjs/dist/system.src.js',
        ], {cwd: 'node_modules'})
        .pipe(uglify())
        .pipe(gulp.dest('build/debug/libs'))
});
gulp.task('debug:inject', ['debug:html', 'debug:move', 'debug:sass', 'debug:libs'], function () {
    let libs = gulp.src([
        'build/debug/libs/shim.min.js',
        'build/debug/libs/system-polyfills.js',
        'build/debug/libs/zone.js',
        'build/debug/libs/Reflect.js',
        'build/debug/libs/Rx.js',
        'build/debug/libs/core.umd.js',
        'build/debug/libs/common.umd.js',
        'build/debug/libs/compiler.umd.js',
        'build/debug/libs/platform-browser.umd.js',
        'build/debug/libs/platform-browser-dynamic.umd.js',
        'build/debug/libs/system.src.js',
        'build/debug/system.config.js',
        'build/debug/**/*.css'
    ], {read: false});

    return gulp
        .src('application/index.html')
        .pipe(inject(libs, {ignorePath: 'build/debug'}))
        .pipe(gulp.dest('build/debug'));
});
gulp.task('debug:ts', function () {
    return gulp.src(['application/**/*.ts',
        '!application/polyfills.ts',
        '!application/vendors.ts',
        './typings/index.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(configTsc.compilerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/debug/app'))
});

gulp.task('release:clean', function () {
    return del([
        'build/compiled/**/*',
        'build/converted/**/*',
        'build/temp/**/*',
        'build/release/**/*',
        '!build/compiled/main-release.ts'
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
        'build/release/scripts.js',
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