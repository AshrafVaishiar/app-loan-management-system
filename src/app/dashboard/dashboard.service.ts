import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Loan } from '../Shared/models/addLoan.model';

@Injectable()
export class DashboardService {
    addNewLoanUrl: string;
    updateLoanUrl: string;
    getAllLoansUrl: string;
    deleteLoanUrl: string;
    constructor(private http: HttpClient) {
        //same urls refactor later
        this.addNewLoanUrl = "http://localhost:37326/api/Loans";
        this.updateLoanUrl = "http://localhost:37326/api/Loans/";
        this.getAllLoansUrl = "http://localhost:37326/api/Loans";
        this.deleteLoanUrl = "http://localhost:37326/api/Loans/";

    }

    addNewLoan(newLoan: Loan): Observable<Loan> {
        return this.http.post<Loan>(this.addNewLoanUrl, newLoan);
    }

    getAllLoans(): Observable<Loan[]> {
        return this.http.get<Loan[]>(this.getAllLoansUrl);
    }

    updateLoan(loan: Loan): Observable<Loan> {
        return this.http.put<Loan>(this.updateLoanUrl+loan.loanID, loan);
    }

    deleteLoan(loan : Loan) : Observable<Loan> {
        return this.http.delete<Loan>(this.deleteLoanUrl+loan.loanID);
    }
}