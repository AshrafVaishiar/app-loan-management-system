import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-dash',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    IsAdmin = false;
    userID = this.router.getCurrentNavigation().extras.state['responseData'].userID;
    constructor(private router: Router) {
        this.router.getCurrentNavigation().extras.state;
        this.IsAdmin = this.router.getCurrentNavigation().extras.state['responseData'].userType === 'admin'? !this.IsAdmin : this.IsAdmin;
    }

}