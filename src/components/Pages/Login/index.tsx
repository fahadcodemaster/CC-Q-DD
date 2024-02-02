import React, { useState } from 'react';

import {
	Container,
	LoginContent,
	FormErrorWhitespace,
	FormErrorDetails,
	Header,
	Description,
	Submit,
	Sublink,
	HeaderContainer,
	FormsContainer,
	StyledForm,
	StyledField
} from './styles.css'

import { Redirect } from 'react-router-dom'

import { Formik, Field, Form, FormikHelpers } from 'formik'
import { ReactComponent as Shape1 } from '../../../assets/shape1.svg'
import { ReactComponent as Shape2 } from '../../../assets/shape2.svg'
import { ReactComponent as Shape3 } from '../../../assets/shape3.svg'
import { ReactComponent as Logo } from '../../../assets/cariclubLogo.svg'
import { ReactComponent as QLogo } from '../../../assets/loginQLogo.svg'
import { ReactComponent as Bar } from '../../../assets/bar.svg'

import { ThemeProvider } from 'styled-components';
import { themes } from '../../Theme';

// import {
//     signInCognito,
//     newUserPasswordReset,
//     initiatePasswordReset,
//     finalizePasswordReset
// } from '../../../services/auth'

import {
	DefaultLoginValues,
	// NewUserPasswordValues,
	// ForgotPasswordValues
} from './validation.types'

import {
	LoginSchema,
	// NewUserPasswordSchema,
	// ForgotPasswordSchema,
} from './validation.schema';
import { getToken, sendResetPasswordEmail } from 'services/cariclub';

type LoginView = "login::default"
	| "login::new_user_password_reset"
	| "login::success"
	| "login::password_reset"

interface UserMessage {
	message: string;
	color: 'firebrick' | 'darkgreen' | 'blue' | 'black';
}

function Login(): JSX.Element {
	const [loginView, setLoginView] = useState<LoginView>('login::default');
	const [defaultLogin, setDefaultLogin] = useState<DefaultLoginValues>();
	const [userEmail, setUserEmail] = useState<string>();
	const [userMessage, setUserMessage] = useState<UserMessage>();

	const handleLoginSubmit = async (values: DefaultLoginValues, setSubmitting: (isSubmitting: boolean) => void) => {
		const signInResult = await getToken(values);
		console.log({ signInResult });

		if (signInResult.message === 'OK') {
			setSubmitting(false);
			const isNewUser = signInResult.data.challengeName === 'NEW_PASSWORD_REQUIRED';
			if (isNewUser) {
				setDefaultLogin(values);
				setLoginView('login::new_user_password_reset');
				setUserMessage({
					message: 'Please enter your name and change your password',
					color: 'black',
				});
			} else {
				setLoginView('login::success');
			}
		} else {
			const passwordResetPending = signInResult.message === 'Password reset required for the user';
			const passwordResetPendingText = `Please select 'forgot password?' below to finish resetting your password`;
			const message = passwordResetPending ? passwordResetPendingText : signInResult.message;

			setUserMessage({
				message,
				color: 'firebrick',
			});
		}
	};

	// const handleNewUserPasswordReset = async (
	//     values: NewUserPasswordValues,
	//     setSubmitting: (isSubmitting: boolean) => void,
	// ) => {
	//     if (defaultLogin) {
	//         const originalUserValues = {
	//             name: values.full_name.trim(),
	//             password: defaultLogin.password,
	//             email: defaultLogin.email,
	//         };
	//         const newPassword = values.password;
	//         const newUserPasswordResetResult = await newUserPasswordReset(originalUserValues, newPassword);
	//         if (newUserPasswordResetResult.status === 'success') {
	//             setLoginView('login::success');
	//         }

	//     } else {
	//         console.error("Cannot handle new user password reset without first verifying via AWS Cognito")
	//     }
	// }

	// const handleForgotPassword = async (
	//     values: ForgotPasswordValues,
	//     setSubmitting: (isSubmitting: boolean) => void,
	// ) => {
	//     const { email } = values;
	//     setSubmitting(false);
	//     if (email) {
	//         setUserEmail(email);
	//         const sentResponse = await sendResetPasswordEmail(email);
	//         setLoginView('login::default');
	//         setUserMessage({
	//             message: 'New password has been sent via email. Please login to continue',
	//             color: 'blue',
	//         });
	//     }
	// }

	const initiateForgotPassword = () => {
		setLoginView("login::password_reset")
	}

	return (
		<ThemeProvider theme={themes.light}>
			<Container>
				<Shape1 className="shape-1" />
				<Shape2 className="shape-2" />
				<Shape3 className="shape-3" />
				<Bar className="bars bar-1" />
				<Bar className="bars bar-2" />
				<Bar className="bars bar-3" />
				<Bar className="bars bar-4" />
				<Bar className="bars bar-5" />
				<HeaderContainer>
					<Logo />
				</HeaderContainer>
				<FormsContainer>
					{loginView === 'login::default' && (
						<LoginContent>

							<Header>
								<QLogo />
								<p>powered by <Logo /></p>
							</Header>
							{userMessage && <Description>{userMessage.message}</Description>}
							<Formik
								initialValues={{
									email: '',
									password: '',
								}}
								validationSchema={LoginSchema}
								onSubmit={(
									values: DefaultLoginValues,
									{ setSubmitting }: FormikHelpers<DefaultLoginValues>,
								) => {
									handleLoginSubmit(values, setSubmitting);
								}}
							>
								{({ errors, touched }) => (
									<StyledForm>
										<StyledField id="email" name="email" placeholder="Email" type="email" error={errors.email && touched.email} />

										<StyledField id="password" name="password" placeholder="Password" type="password" error={errors.password && touched.password} />
										<Submit type="submit">Login</Submit>
									</StyledForm>
								)}
							</Formik>
							{/* <Sublink>
								<a onClick={initiateForgotPassword}>Forgot password?</a>
							</Sublink> */}
						</LoginContent>
					)}

					{/* {loginView === 'login::password_reset' && (
                        <LoginContent>
                            <Header><h2>Password reset</h2></Header>
                            {userMessage && <Description>{userMessage.message}</Description>}
                            <Formik
                                initialValues={{
                                    email: '',
                                }}
                                validationSchema={ForgotPasswordSchema}
                                onSubmit={(
                                    values: ForgotPasswordValues,
                                    { setSubmitting }: FormikHelpers<ForgotPasswordValues>,
                                ) => {
                                    handleForgotPassword(values, setSubmitting);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <StyledField id="email" name="email" placeholder="Email" type="email" error={errors.email && touched.email} />
                                        <Submit type="submit">Submit</Submit>
                                    </Form>
                                )}
                            </Formik>
                        </LoginContent>
                    )} */}

					{/* {loginView === 'login::new_user_password_reset' && (
                        <LoginContent>
                            <Header><h2>Welcome</h2></Header>
                            {userMessage && <Description >{userMessage.message}</Description>}
                            <Formik
                                initialValues={{
                                    full_name: '',
                                    password: '',
                                    confirm_password: '',
                                }}
                                validationSchema={NewUserPasswordSchema}
                                onSubmit={(
                                    values: NewUserPasswordValues,
                                    { setSubmitting }: FormikHelpers<NewUserPasswordValues>,
                                ) => {
                                    handleNewUserPasswordReset(values, setSubmitting);
                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <label htmlFor="full_name">Your Full Name</label>
                                        {errors.full_name && touched.full_name ? (
                                            <FormErrorDetails>{errors.full_name}</FormErrorDetails>
                                        ) : null}
                                        <Field id="full_name" name="full_name" placeholder="your full name" type="text" />
                                        <label htmlFor="password">Password</label>
                                        {errors.password && touched.password ? (
                                            <FormErrorDetails>{errors.password}</FormErrorDetails>
                                        ) : null}
                                        <Field id="password" name="password" placeholder="your password" type="password" />
                                        <label htmlFor="confirm_password">Confirm Password</label>
                                        {errors.confirm_password && touched.confirm_password ? (
                                            <FormErrorDetails>{errors.confirm_password}</FormErrorDetails>
                                        ) : null}
                                        <Field
                                            id="confirm_password"
                                            name="confirm_password"
                                            placeholder="confirm your password"
                                            type="password"
                                        />
                                        <Submit type="submit">Submit</Submit>
                                    </Form>
                                )}
                            </Formik>
                        </LoginContent>
                    )} */}

					{loginView === 'login::success' && <Redirect to="/" />}
				</FormsContainer>
			</Container>
		</ThemeProvider>

	);
}

export default Login;
