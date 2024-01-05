export interface User {
  name?: string | null | undefined;
  id?: string;
  saId?: string;
  role?: string;
  userEmail?:string;
  userName?: string;
  accessToken?: string;
  permissions?: string;
}
