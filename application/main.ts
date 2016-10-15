//app
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {TestModule} from './modules/test';

//if (process.env.ENV === 'production') {
    enableProdMode();
//}

platformBrowserDynamic().bootstrapModule(TestModule);