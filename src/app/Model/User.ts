export interface User {
    userId?:number,
    firstName?: string,
    lastName?: string;
    password?: string;
    email?: string;
    role?: number;
    createdDate?:Date;
}