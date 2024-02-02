
import * as Yup from 'yup'



export const LoginSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is Required"),
    password: Yup.string()
        .required('please enter your password')
})


//TODO: new password should also not be the same as the old password. likely cognito would throw an error
//in this case regardless, but better off to put it in this validation before that happens.
export const NewUserPasswordSchema = Yup.object({
    full_name: Yup.string().required('Please enter your name'),
    password: Yup.string().required('Password is required')
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            `Must Contain 8 Characters, one Uppercase \none Lowercase, One Number \nand one Special Case Character`
        ),
    confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], "Passwords don't match")
        .required('Password confirm is required')
})


export const ForgotPasswordSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is Required"),
})