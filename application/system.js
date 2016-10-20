(function () {
    System.config({
        map: {
            'app': '',
            '@angular/core': 'libs/core.umd.js',
            '@angular/common': 'libs/common.umd.js',
            '@angular/compiler': 'libs/compiler.umd.js',
            '@angular/platform-browser': 'libs/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'libs/platform-browser-dynamic.umd.js',
            '@angular/http': 'libs/http.umd.js',
            '@angular/router': 'libs/router.umd.js',
            '@angular/forms': 'libs/forms.umd.js',
            'rxjs': 'libs/rx.js',
            'rxjs/Subject': 'libs/rx.js',
            'rxjs/Observable': 'libs/rx.js'
        },
        packages: {
            app: {
                main: 'main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            }
        },
        meta: {
            '*.html': {
                loader: 'text'
            },
            '*.css': {
                loader: 'text'
            }
        }
    });
    System.import('app').then(null, console.error.bind(console));
})();
