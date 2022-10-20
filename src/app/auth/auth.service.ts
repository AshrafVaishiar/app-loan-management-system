import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from "./user.model";

export interface AuthResponseData {
    id: string; //	The user id  of the user.
    userName: string; //Whether admin / normal user
    email: string; //email id of the logged in user
    token: string; // jwt token string
}


@Injectable({ providedIn: 'root' })
export class AuthService {
    loginURL: string = "https://localhost:7280/login";
    user = new BehaviorSubject<User>(null);
    expiresIn = 1200; // auto-logout after 20 mins
    constructor(private http: HttpClient, private router: Router) {
        this.initLoadedUser();
    }

    private tokenExpirationTimer: any;

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(this.loginURL, {
                email: email,
                password: password
            })
            .pipe(
                tap((responseData) => {
                    this.handleAuthentication(
                        responseData.token
                    );
                }),
                catchError(this.handleError)
            );
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMsg = 'An unknown error occured!';
        console.log(errorResponse);
        if (!errorResponse.error.errorType) {
            return throwError(errorMsg);
        } else {
            switch (errorResponse.error.errorType) {
                case 'INCORRECT PASSWORD':
                    errorMsg = 'Incorrect Password!';
                    break;
                case 'USR_RECORD_NOT_FOUND':
                    errorMsg = 'User does not exist!';
                    break;
            }
        }
        return throwError(errorMsg);
    }

    initLoadedUser() {
        const userData: {
            token: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.token
        );

        if (loadedUser.token) {
          this.user.next(loadedUser);
        }
    }
    autoLogin() {
        const userData: {
          userID: string;
          userType: string;
          _ExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return;
        }

        // const loadedUser = new User(
        //   userData.userID,
        //   userData.userType,
        //   new Date(userData._ExpirationDate)
        // );
    
        // if (loadedUser.userID) {
        //   this.user.next(loadedUser);
        //   const exxpirationDuration =
        //     new Date(userData._ExpirationDate).getTime() -
        //     new Date().getTime();
        //   this.autoLogOut(exxpirationDuration);
        // }
      }

    autoLogOut(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }


    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    private handleAuthentication(
        token: string
    ) {
        //const expirationDate = new Date(new Date().getTime() + this.expiresIn*1000);
        //console.log(expirationDate); // 5min
        //const user = new User(userID, userType, expirationDate);
        const user = new User(token);
        this.user.next(user);
        //this.autoLogOut(this.expiresIn*1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }


}