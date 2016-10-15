const gulp = require('gulp'),
    del = require('del'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tscConfig = require('./tsconfig.json');

gulp.task('clean', function () {
    return del('build/**/*');
});
gulp.task('compile',  function () {
    return gulp
        .src('application/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});
gulp.task('copy:libs', function () {
    return gulp
        .src([
            "core-js/client/shim.min.js",
            "zone.js/dist/zone.js",
            "reflect-metadata/Reflect.js",
            "rxjs/bundles/Rx.js",
            "@angular/forms/bundles/forms.umd.js",
            "@angular/http/bundles/http.umd.js",
            "@angular/router/bundles/router.umd.js",
            "@angular/core/bundles/core.umd.js",
            "@angular/common/bundles/common.umd.js",
            "@angular/compiler/bundles/compiler.umd.js",
            "@angular/platform-browser/bundles/platform-browser.umd.js",
            "@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
            'systemjs/dist/system-polyfills.js',
            'systemjs/dist/system.src.js',
        ], {cwd: "node_modules"})
        .pipe(gulp.dest('build/libs'))
});
gulp.task('copy:assets', function () {
    return gulp.src(['application/**/*.css', 'application/**/*.html', 'systemjs.config.js']/*, { base : './' }*/)
        .pipe(gulp.dest('build'))
});
gulp.task('sass', function () {
    return gulp.src('application/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build'));
});
gulp.task('inject',['compile','copy:libs','copy:assets','sass'], function () {
    let libs = gulp.src([
        'build/libs/shim.min.js',
        'build/libs/system-polyfills.js',
        'build/libs/zone.js',
        'build/libs/Reflect.js',
        'build/libs/Rx.js',
        'build/libs/core.umd.js',
        'build/libs/common.umd.js',
        'build/libs/compiler.umd.js',
        'build/libs/platform-browser.umd.js',
        'build/libs/platform-browser-dynamic.umd.js',

        'build/libs/system.src.js',
        'build/systemjs.config.js'
    ], {read: false});

    return gulp
        .src('application/index.html')
        .pipe(inject(libs, {ignorePath: '/build/'}))
        .pipe(gulp.dest('build'));
});

gulp.task('build', [ 'inject']);