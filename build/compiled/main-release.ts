
import {platformBrowser} from '@angular/platform-browser';
import {InitModuleNgFactory} from './modules/init.ngfactory';
import {enableProdMode} from "@angular/core";
enableProdMode();
platformBrowser().bootstrapModuleFactory(InitModuleNgFactory);