var gulp = require('gulp'),
    del = require('del'),
    series = require("gulp-series"),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    configTsc = require('./tsconfig-tsc.json');
    config = require('./tsconfig.json');

gulp.task('debug:clean', function () {
    return del('build/debug/**/*');
});
gulp.task('debug:compile', ['debug:clean'], function () {
    return gulp
        .src('application/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(config.compilerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/debug'));
});
gulp.task('debug:assets', ['debug:clean'], function () {
    return gulp
        .src(['application/**/*.{html,css,js}'])
        .pipe(gulp.dest('build/debug'))
});
gulp.task('debug:sass', ['debug:clean'], function () {
    return gulp
        .src(['application/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/debug'))
});
gulp.task('debug:libs', ['debug:clean'], function () {
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
        //.pipe(uglify())
        .pipe(gulp.dest('build/debug/libs'))
});
gulp.task('debug:inject', ['debug:compile', 'debug:assets', 'debug:sass', 'debug:libs'], function () {
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
        'build/debug/system.js',
        'build/debug/**/*.css'
    ], {read: false});

    return gulp
        .src('application/index.html')
        .pipe(inject(libs, {ignorePath: 'build/debug'}))
        .pipe(gulp.dest('build/debug'));
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
gulp.task('release:assets', ['release:clean'], function () {
    return gulp.src(['application/{components,modules}**/*.{html,ts}', 'application/main.ts'])
        .pipe(gulp.dest('build/compiled'))
});
gulp.task('release:sass', ['release:clean'], function () {
    return gulp.src('application/components/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/compiled/components'));
});
gulp.task('release:precompile', ['release:assets', 'release:sass']);
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