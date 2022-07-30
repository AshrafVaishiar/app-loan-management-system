import { Pipe, PipeTransform } from '@angular/core';
import { Loan } from './Shared/models/addLoan.model';

@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(loans: Loan[], searchValues: any[], key: string[]): any {
    searchValues.forEach((searchValue, index) => {
      if (searchValue) {
        loans = loans.filter((loan) => {
          return ((loan[key[index]]).toString()
            .toLowerCase()
            .indexOf(searchValue.toString().toLowerCase()) !== -1)
        });
      }
    });
    return loans;
  }
}
