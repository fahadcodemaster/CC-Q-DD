// import { APIClass, Auth } from 'aws-amplify'
// import { validateUser } from "./reporting"

// import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js'
// import { ReportingAPI } from '../../types'

// interface UserCredentials {
//     email: string;
//     password: string;
//     name?: string;
// }

// interface AuthResponse {
//     status: "success" | "error";
//     message: string;
//     data: CognitoUser | any;
// }

export const auth = () => {
    
}


// export const signInInsights = async () => {
//     const session = await Auth.currentSession()
//     if (session.isValid()) {
//         const { payload: token } = session.getIdToken()

//         if (!token["cognito:groups"] || token["cognito:groups"].length < 1) {
//             return ({ message: "groupname does not exist" })
//         }

//         const user = {
//             name: token.name,
//             email: token.email,
//             cognito_groupname: token["cognito:groups"][0],
//             cognito_username: token["cognito:username"]
//         }
//         return validateUser(user)
//     } else {
//         return { message: "session is not valid" }
//     }
// }

// /**
// * @function signInCognito
// * @description signs a user in with cognito
// **/
// export const signInCognito: (user: UserCredentials) => Promise<AuthResponse>
//     = async (user: UserCredentials) => {

//         try {
//             const authResponse: Promise<CognitoUser | any> = await Auth.signIn(user.email, user.password);

//             const signInResponse: AuthResponse = {
//                 status: "success",
//                 message: "user sign in succeeded",
//                 data: { ...authResponse }
//             }

//             return signInResponse

//         } catch (e) {
//             console.error(e.message);
//             const signInResponse: AuthResponse = {
//                 status: "error",
//                 message: e.message,
//                 data: e
//             }

//             return signInResponse
//         }

//     }

// /**
// * @function initiatePasswordReset
// * @description in user flow for forgot password, initiate password reset sends prompt for 
// * a verification email to be sent
// **/
// export const initiatePasswordReset: (userEmail: string) => Promise<AuthResponse>
//     = async (userEmail: string) => {

//         try {
//             const response: Promise<any> = await Auth.forgotPassword(userEmail);

//             const resetPasswordResponse: AuthResponse = {
//                 status: "success",
//                 message: "We've sent your code via email, so please check the inbox for the address you provided.",
//                 data: { ...response }
//             }

//             return resetPasswordResponse

//         } catch (e) {
//             console.error(e.message);
//             const resetPasswordResponse: AuthResponse = {
//                 status: "error",
//                 message: e.message,
//                 data: e
//             }

//             return resetPasswordResponse
//         }

//     }

// /**
// * @function finalizePasswordReset
// * @description in user flow for user forgot password, finalize password reset assumes the user has 
// * received an email with a verification code
// **/
// export const finalizePasswordReset: (email: string, newPassword: string, verificationCode: string) => Promise<AuthResponse>
//     = async (email: string, verificationCode: string, newPassword: string) => {

//         try {
//             await Auth.forgotPasswordSubmit(email, verificationCode, newPassword);
//             const resetPasswordResponse: AuthResponse = {
//                 status: "success",
//                 message: "Your password has been successfully changed.",
//                 data: {}
//             }

//             return resetPasswordResponse

//         } catch (e) {
//             console.error(e.message);
//             const resetPasswordResponse: AuthResponse = {
//                 status: "error",
//                 message: e.message,
//                 data: e
//             }

//             return resetPasswordResponse
//         }

//     }


// /**
// * @function newUserPasswordReset
// * @description in user flow for new user, they are prompted to change their password 
// * on first login
// **/
// export const newUserPasswordReset = async (fullUserCredentials: UserCredentials, password: string) => {

//     try {
//         const { email, password, name } = fullUserCredentials
//         const cognitoUser = await Auth.signIn(email, password)
//         const confirmResponse: Promise<CognitoUser | any> = await Auth.completeNewPassword(cognitoUser, password, { name })
//         const newUserPasswordResetResponse: AuthResponse = {
//             status: "success",
//             message: "record successfully validated",
//             data: { ...confirmResponse }
//         }

//         return newUserPasswordResetResponse
//     } catch (e) {
//         console.error(e.message);
//         const signInResponse: AuthResponse = {
//             status: "error",
//             message: e.message,
//             data: e
//         }

//         return signInResponse
//     }


// }

// /**
// * @function newUserPasswordReset
// * @description verifies whether the user is logged in and can access a page
// **/
// export const verifyLogin = async () => {
//     try {
//         const currentUser = await Auth.currentUserInfo()

//         const hasNoValues = currentUser ? Object.keys(currentUser).length === 0 : 0

//         if (!currentUser || hasNoValues) {
//             const currentUserResponse: AuthResponse = {
//                 status: "error",
//                 message: "no user is authenticated",
//                 data: currentUser
//             }

//             return currentUserResponse
//         }

//         const currentUserResponse: AuthResponse = {
//             status: "success",
//             message: "record successfully validated",
//             data: { ...currentUser }
//         }

//         return currentUserResponse
//     }
//     catch (e) {
//         console.error(e.message);
//         const currentUserResponse: AuthResponse = {
//             status: "error",
//             message: e.message,
//             data: e
//         }

//         return currentUserResponse
//     }
// }
