
export interface DefaultLoginValues {
    email: string;
    password: string;
    fullName?: string;
}

export interface NewUserPasswordValues {
    full_name: string;
    password: string;
    confirm_password: string;
}

export interface ForgotPasswordValues {
    email: string;
}