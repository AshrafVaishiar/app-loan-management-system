import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { DashboardComponent } from "./dashboard.component";

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        RouterModule.forChild([{ path: '', component: DashboardComponent, canActivate: [AuthGuard] }]),
    ],
})
export class DashboardModule { }