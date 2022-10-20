import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthInterceptorService } from "../auth/auth-interceptor.service";
import { AuthComponent } from "../auth/auth.component";
import { AuthGuard } from "../auth/auth.guard";
import { SearchfilterPipe } from "../searchfilter.pipe";
import { DashboardComponent } from "./dashboard.component";
import { DashboardService } from "./dashboard.service";

@NgModule({
    declarations: [DashboardComponent, SearchfilterPipe],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: DashboardComponent, canActivate: [AuthGuard] }]),
    ],
    providers: [DashboardService, {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi : true
    }]
})
export class DashboardModule { }