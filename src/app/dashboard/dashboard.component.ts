import { Component, EventEmitter, Injectable, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DashboardService } from "./dashboard.service";
import { Loan } from '../Shared/models/addLoan.model';
import { AlertComponent } from "../Shared/alert/alert.component";
import { observable, Observable, Subscribable, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { Course } from "../Shared/models/course.model";

@Component({
    selector: 'app-dash',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    addNewLoanForm: FormGroup;
    @Output() edit = new EventEmitter<Loan>();
    loanList: Loan[];
    courseList: Course[];
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
        //this.initForm();
        this.getAllCourses();
    }

    // onAddLoan() {
    //     this.addNewLoanForm.controls['loanID'].setValue('_' + Math.random().toString(36).substr(2, 9));
    //     console.log("from add", this.addNewLoanForm.value);
    //     this.dashService.addNewLoan(this.addNewLoanForm.value).subscribe(res => {
    //         this.getAllLoans();
    //     }, (err) => {
    //         console.log("Error while adding data");
    //     })
    // }

    // onEditLoan(loan: Loan) {
    //     console.log("from on edit", loan);
    //     this.addNewLoanForm.controls['loanID'].setValue(loan.loanID);
    //     this.addNewLoanForm.controls['loanNumber'].setValue(loan.loanNumber);
    //     this.addNewLoanForm.controls['firstName'].setValue(loan.firstName);
    //     this.addNewLoanForm.controls['lastName'].setValue(loan.lastName);
    //     this.addNewLoanForm.controls['address'].setValue(loan.address);
    //     this.addNewLoanForm.controls['loanType'].setValue(loan.loanType);
    //     this.addNewLoanForm.controls['loanTerm'].setValue(loan.loanTerm);
    //     this.addNewLoanForm.controls['loanAmount'].setValue(loan.loanAmount);
    //     this.loanObj = loan;
    // }

    getAllCourses() {
        this.dashService.getAllCourses().subscribe((res) => {
            this.courseList = res;
        }, (err) => {
            console.log("Error while getAllCourses");
        })
    }

    // onUpdateLoan() {
    //     this.loanObj.loanID = this.addNewLoanForm.value.loanID;
    //     this.loanObj.loanNumber = this.addNewLoanForm.value.loanNumber;
    //     this.loanObj.firstName = this.addNewLoanForm.value.firstName;
    //     this.loanObj.lastName = this.addNewLoanForm.value.lastName;
    //     this.loanObj.address = this.addNewLoanForm.value.address;
    //     this.loanObj.loanAmount = this.addNewLoanForm.value.loanAmount;
    //     this.loanObj.loanTerm = this.addNewLoanForm.value.loanTerm;
    //     this.loanObj.loanType = this.addNewLoanForm.value.loanType;
    //     console.log(this.loanObj.firstName);
    //     this.dashService.updateLoan(this.loanObj).subscribe((res) => {
    //         console.log("successful", res);
    //         this.getAllLoans();
    //     }, (err) => {
    //         console.log("form update error:", err);
    //     });
    // }

    // onDeleteLoan(loan: Loan) {
    //     this.dashService.deleteLoan(loan).subscribe((res) => {
    //         this.getAllLoans();
    //         console.log("from delete res:", res);
    //         alert("Are You Sure?");
    //     }, (err) => {
    //         console.log("from delete err:", err);
    //     });
    // }

    onLogOut() {
        this.authService.logout();
    }

    // private initForm() {
    //     this.addNewLoanForm = new FormGroup({
    //         loanID: new FormControl(null),
    //         loanNumber: new FormControl(null, Validators.required),
    //         firstName: new FormControl(null, Validators.required),
    //         lastName: new FormControl(null, Validators.required),
    //         address: new FormControl(null, Validators.required),
    //         loanType: new FormControl(null, Validators.required),
    //         loanTerm: new FormControl(null, Validators.required),
    //         loanAmount: new FormControl(null, [Validators.required, Validators.min(1)]),
    //     })
    // }
}