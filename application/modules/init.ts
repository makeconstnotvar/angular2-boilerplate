import {NgModule} from '@angular/core';
import {Test} from  '../components/test'
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
    declarations: [Test],
    imports: [BrowserModule],
    bootstrap: [Test]
})
export class InitModule {

}