export class UserDto {
  id?: number;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  phoneNumber?: string;
  email!: string;
  fileImage?: string;
  img?: string;
  role!: string;
}