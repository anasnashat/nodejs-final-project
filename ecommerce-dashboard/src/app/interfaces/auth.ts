export interface Auth {
    name: string,
    email: string,
    password: string,
    repassword: string,
    profileImage:string
}
export interface AuthLogin{
    email: string,
    password:string
}
export interface AuthForgetPassword{
    email:string
}
export interface AuthResetPassword{
    code: string,
    newpassword: string,
    confirmPassword:string
}