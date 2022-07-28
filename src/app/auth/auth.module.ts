import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule  } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../Shared/shared.module";
import { AuthInterceptorService } from "./auth-interceptor.service";
import { AuthComponent } from "./auth.component";

@NgModule({
    declarations: [AuthComponent],
    imports: [
        SharedModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([{ path: '', component: AuthComponent }]),
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptorService,
        multi : true
    }]
})
export class AuthModule { }