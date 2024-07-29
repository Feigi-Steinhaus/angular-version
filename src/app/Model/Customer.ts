import { StatusCodeUser } from "./StatusCodeUser";

export interface Customer {
    customerId: number,
    firstName: string,
    lastName: string;
    phone: string,
    email: string,
    businessName: string,
    source: string,
    status: StatusCodeUser,
    createdDate?: Date,
    // projects: Project[],
}
