(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            //'libs/': 'node_modules/'
        },
        // map tells the System loader where to look for things
        map: {
            // our app is within the app folder
            app: 'app',

            // angular bundles
            '@angular/core': 'libs/core.umd.js',
            '@angular/common': 'libs/common.umd.js',
            '@angular/compiler': 'libs/compiler.umd.js',
            '@angular/platform-browser': 'libs/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'libs/platform-browser-dynamic.umd.js',
            '@angular/http': 'libs/http.umd.js',
            '@angular/router': 'libs/router.umd.js',
            '@angular/forms': 'libs/forms.umd.js',
            '@angular/upgrade': 'libs/upgrade.umd.js',

            // other libraries
            'rxjs': 'libs/rx.js',
            'rxjs/Subject': 'libs/rx.js',
            'rxjs/Observable': 'libs/rx.js'
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            }
        }
    });
})(this);