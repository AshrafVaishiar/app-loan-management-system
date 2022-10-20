export class User {
    constructor(
      //public userID: string,
      //public userType: string,
      //private _ExpirationDate: Date
      public token: string
    ) {}
    // get token() {
    //   if (new Date() > this._ExpirationDate || !this._ExpirationDate) {
    //     return null;
    //   }
    //   return this._token;
    // }
  }