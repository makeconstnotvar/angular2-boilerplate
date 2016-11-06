import {NgModule} from '@angular/core';
import {Test} from  '../components/index/index'
import {BrowserModule} from '@angular/platform-browser';
import {RoutingModule} from "../components/routes";
import {Page2} from "../components/page2/page2";
import {Page1} from "../components/page1/page1";

@NgModule({
    declarations: [Test,Page1,Page2],
    imports: [BrowserModule,RoutingModule],
    bootstrap: [Test]
})
export class InitModule {

}