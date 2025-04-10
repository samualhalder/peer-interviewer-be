export interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  description?: string;
  image?: string;
  organization?: string;
  location?: string;
  isAccountDeleted?: boolean;
  createdAt?: Date;
}
