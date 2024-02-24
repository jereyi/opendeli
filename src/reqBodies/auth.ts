export type SignupReqBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
};

export type LoginReqBody = {
  email: string;
  password: string;
};

export type PasswordResetReqBody = {
  email: string;
  password: string;
  newPassword: string;
};
