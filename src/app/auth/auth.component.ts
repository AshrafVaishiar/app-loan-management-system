import { state } from "@angular/animations";
import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { AlertComponent } from "../Shared/alert/alert.component";
import { PlaceHolderDirective } from "../Shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy, OnInit {
    error: string | null = null;
    private closesub: Subscription;
    @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;
    isLoading = false;
    AuthForm: FormGroup;

    constructor(private authService: AuthService, private router: Router,
        private compFactoryResolver: ComponentFactoryResolver,
    ) {

    }

    ngOnInit(): void {
        this.InitForm();
        console.log(this.AuthForm);
    }

    ngOnDestroy(): void {
        if (this.closesub) {
            this.closesub.unsubscribe();
        }
    }
    onSubmit() {
        if (!this.AuthForm.valid) {
            return;
        }
        const email = this.AuthForm.value.email;
        const password = this.AuthForm.value.password;
        this.isLoading = true;

        let authObs: Observable<AuthResponseData>;

        authObs = this.authService.login(email, password);


        authObs.subscribe(
            (responseData) => {
                console.log(responseData);
                this.isLoading = false;
                this.router.navigate(['/dashboard'], {state : {responseData}});
            },
            (errorMessage) => {
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );
        this.AuthForm.reset();
    }

    private showErrorAlert(message: string) {
        //dynamically creating alert component
        const alertcompFactory =
            this.compFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(alertcompFactory);
        componentRef.instance.message = message;
        this.closesub = componentRef.instance.close.subscribe(() => {
            this.closesub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    private InitForm() {
        this.AuthForm = new FormGroup({
            email: new FormControl(null,[Validators.required, Validators.email]),
            password: new FormControl(null,[Validators.required, Validators.minLength(6)])
        });
    }
}