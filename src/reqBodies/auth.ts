export type SignupReqBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    rememberMe?: boolean;
}

export type LoginReqBody = {
    email: string;
    password: string;
};