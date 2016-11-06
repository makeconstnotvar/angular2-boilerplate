import {Routes, RouterModule} from "@angular/router";
import {Page2} from "./page2/page2";
import {Page1} from "./page1/page1";
import {NgModule} from "@angular/core";

const routes: Routes = [
    {path: '', redirectTo: '/page1', pathMatch:'full'},
    {path: 'page1', component: Page1},
    {path: 'page2', component: Page2}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class RoutingModule {
}