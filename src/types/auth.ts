export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  user_role?: string;

  registered?: boolean;
}

export interface LoginUserData {
  email: string;
  password: string;
}
