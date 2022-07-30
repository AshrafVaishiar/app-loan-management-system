import { Component, EventEmitter, Injectable, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DashboardService } from "./dashboard.service";
import { Loan } from '../Shared/models/addLoan.model';
import { AlertComponent } from "../Shared/alert/alert.component";
import { observable, Observable, Subscribable, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: 'app-dash',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    addNewLoanFrom: FormGroup;
    @Output() edit = new EventEmitter<Loan>();
    loanList: Loan[];
    loanObj: Loan;
    IsAdmin = false;
    firstName: string;
    lastName: string;
    loanNumber: number;
    userData: {
        userID: string;
        userType: string;
        _ExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    constructor(private router: Router,
        private dashService: DashboardService,
        private authService: AuthService) {
        this.router.getCurrentNavigation().extras.state;
        if (this.userData) {
            this.IsAdmin = this.userData.userType === 'admin' ? !this.IsAdmin : this.IsAdmin;
        }
    }

    ngOnInit(): void {
        this.initForm();
        this.getAllLoans();
    }

    onAddLoan() {
        this.addNewLoanFrom.controls['loanID'].setValue('_' + Math.random().toString(36).substr(2, 9));
        console.log("from add", this.addNewLoanFrom.value);
        this.dashService.addNewLoan(this.addNewLoanFrom.value).subscribe(res => {
            this.getAllLoans();
        }, (err) => {
            console.log("Error while adding data");
        })
    }

    onEditLoan(loan: Loan) {
        console.log("from on edit", loan);
        this.addNewLoanFrom.controls['loanID'].setValue(loan.loanID);
        this.addNewLoanFrom.controls['firstName'].setValue(loan.firstName);
        this.addNewLoanFrom.controls['lastName'].setValue(loan.lastName);
        this.addNewLoanFrom.controls['address'].setValue(loan.address);
        this.addNewLoanFrom.controls['loanType'].setValue(loan.loanType);
        this.addNewLoanFrom.controls['loanTerm'].setValue(loan.loanTerm);
        this.addNewLoanFrom.controls['loanAmount'].setValue(loan.loanAmount);
        this.loanObj = loan;
    }

    getAllLoans() {
        this.dashService.getAllLoans().subscribe((res) => {
            this.loanList = res;
        }, (err) => {
            console.log("Error while getAllLoans");
        })
    }

    onUpdateLoan() {
        this.loanObj.loanID = this.addNewLoanFrom.value.loanID;
        this.loanObj.firstName = this.addNewLoanFrom.value.firstName;
        this.loanObj.lastName = this.addNewLoanFrom.value.lastName;
        this.loanObj.address = this.addNewLoanFrom.value.address;
        this.loanObj.loanAmount = this.addNewLoanFrom.value.loanAmount;
        this.loanObj.loanTerm = this.addNewLoanFrom.value.loanTerm;
        this.loanObj.loanType = this.addNewLoanFrom.value.loanType;
        console.log(this.loanObj.firstName);
        this.dashService.updateLoan(this.loanObj).subscribe((res) => {
            console.log("successful", res);
            this.getAllLoans();
        }, (err) => {
            console.log("form update error:", err);
        });
    }

    onDeleteLoan(loan: Loan) {
        this.dashService.deleteLoan(loan).subscribe((res) => {
            this.getAllLoans();
            console.log("from delete res:", res);
            alert("Are You Sure?");
        }, (err) => {
            console.log("from delete err:", err);
        });
    }

    onLogOut() {
        this.authService.logout();
    }

    private initForm() {
        this.addNewLoanFrom = new FormGroup({
            loanID: new FormControl(null),
            loanNumber: new FormControl(null),
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            address: new FormControl(null, Validators.required),
            loanType: new FormControl(null, Validators.required),
            loanTerm: new FormControl(null, Validators.required),
            loanAmount: new FormControl(null, Validators.required),
        })
    }
}