import { Pipe, PipeTransform } from '@angular/core';
import { Loan } from './Shared/models/addLoan.model';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(loans: Loan[], searchValue: string): Loan[] {
    if (!loans || !searchValue) {
      return loans;
    }
    return loans.filter(loan => 
    loan.firstName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
    loan.lastName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
    loan.address.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
    loan.loanType.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
    loan.loanTerm.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
    loan.loanAmount.toString().toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));
  }
}
