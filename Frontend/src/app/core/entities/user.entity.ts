export class E_User {
    constructor(
        public token: string,
        public userName: string,
        public lastLogin: Date
    ) { }
}