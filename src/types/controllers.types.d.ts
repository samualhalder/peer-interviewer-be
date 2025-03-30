export interface UserType {
  id: String;
  name: String;
  email: String;
  role: String;
  password: String;
  description?: String;
  image?: String;
  organization?: String;
  location?: String;
  isAccountDeleted?: Boolean;
  createdAt?: Date;
}
