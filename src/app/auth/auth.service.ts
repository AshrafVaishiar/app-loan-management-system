import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from "./user.model";

export interface AuthResponseData {
    userID: string; //	The user id  of the user.
    userType: string; //Whether admin / normal user
}


@Injectable({ providedIn: 'root' })
export class AuthService {
    loginURL: string = "http://localhost:37326/api/Login";
    user = new BehaviorSubject<User>(null);
    expiresIn = 300; // auto-logout after 5 min
    constructor(private http: HttpClient, private router: Router) {

    }

    private tokenExpirationTimer: any;

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(this.loginURL, {
                userID: email,
                userPassword: password
            })
            .pipe(
                catchError(this.handleError),
                tap((responseData) => {
                    this.handleAuthentication(
                        responseData.userID,
                        responseData.userType
                    );
                })
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

    autoLogin() {
        const userData: {
          userID: string;
          userType: string;
          _ExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return;
        }
        const loadedUser = new User(
          userData.userID,
          userData.userType,
          new Date(userData._ExpirationDate)
        );
    
        if (loadedUser.userID) {
          this.user.next(loadedUser);
          const exxpirationDuration =
            new Date(userData._ExpirationDate).getTime() -
            new Date().getTime();
          this.autoLogOut(exxpirationDuration);
        }
      }

    autoLogOut(expirationDuration: number) {
        console.log(expirationDuration);
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
        userID: string,
        userType: string
    ) {
        const expirationDate = new Date(new Date().getTime() + this.expiresIn*1000); // 5min
        const user = new User(userID, userType, expirationDate);
        this.user.next(user);
        this.autoLogOut(this.expiresIn*1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }


}