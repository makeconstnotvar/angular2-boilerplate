var packages = {
    "app": {"defaultExtension": "js"}
};

var ng2PackageNames = [
    'common', 'router', 'compiler', 'core', 'forms', 'http', 'platform-browser', 'platform-browser-dynamic', /*'testing', 'upgrade'*/
];

ng2PackageNames.forEach(function (pkgName) {
    packages["@angular/" + pkgName] = {main: 'bundles/' + pkgName + '.umd.js', defaultExtension: 'js'};
});

System.config({
    transpiler: false,
    defaultJSExtensions: true,

    packages: packages,

    paths: {"npm:*": "node_modules/*"},

    map: {
        "@angular": "npm:@angular",
        "rxjs": "npm:rxjs",
    }
});

System.import('build/debug/app/main');