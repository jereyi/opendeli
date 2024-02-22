export type SignupReqBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    remember_me?: boolean;
}

export type LoginReqBody = {
    email: string;
    password: string;
};