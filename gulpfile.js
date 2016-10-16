const gulp = require('gulp'),
    del = require('del'),
    series = require("gulp-series"),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tscConfig = require('./tsconfig-tsc.json');

gulp.task('clean:debug', function () {
    return del('build/debug/**/*');
});

gulp.task('compile', function () {
    return gulp
        .src('application/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write())
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
gulp.task('inject', ['compile', 'copy:libs', 'copy:assets', 'sass'], function () {
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


gulp.task('precompile:copy', ['release:clean'], function () {
    return gulp.src(['application/{components,modules}**/*.{html,ts}', 'application/main.ts'])
        .pipe(gulp.dest('build/compiled'))
});
gulp.task('precompile:sass', ['release:clean'], function () {
    return gulp.src('application/components/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/compiled/components'));
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
gulp.task('release:precompile', ['precompile:copy', 'precompile:sass']);
gulp.task('release:js', function () {
    return gulp.src([
        "node_modules/zone.js/dist/zone.js",
        "node_modules/reflect-metadata/Reflect.js",
        'bundle.js'])
        .pipe(concat('scripts.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('build/release/js'));
});
gulp.task('release:css', function () {
    gulp.src('application/css/**/*.{css,scss}')
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('build/release/css'))
});
gulp.task('release:inject', function () {
    let files = gulp.src([
        'build/release/js/*.js',
        'build/release/css/*.css'
    ], {read: false});

    return gulp.src('application/index.html')
        .pipe(inject(files, {ignorePath: '/build/release/'}))
        .pipe(gulp.dest('build/release'));
});