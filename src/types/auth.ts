export interface RegisterUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_role?: string;
  invite_code?: string;
  registered?: boolean;
}

export interface LoginUserData {
  email: string;
  password: string;
}
