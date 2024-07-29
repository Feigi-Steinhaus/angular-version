import { RoleCodeUser } from "./RoleCodeUser";

export interface User {
    userId?:number,
    firstName?: string,
    lastName?: string;
    password?: string;
    email?: string;
    role?: RoleCodeUser;
    createdDate?:Date;
}