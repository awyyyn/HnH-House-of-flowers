import { environment } from "../environments/environment.js";
import { transporter } from "../services/nodemailer.js";
import { RegistrationLink } from "../types/index.js";

export const sendAdminLoginCredentials = async ({
	email,
	password,
}: RegistrationLink & { password: string }) => {
	const link = `${environment.CLIENT_URL}/auth/login`;

	const mailOptions = {
		from: environment.EMAIL,
		sender: {
			name: "H&H - House of Flowers",
			address: environment.EMAIL!,
		},
		to: email,
		subject: "Registration Link",
		html: `
            <h1 style={h1}>Welcome to the Admin Team</h1>
            <p style={text}>Hello {adminName},</p>
            <p style={text}>Your admin account has been created. Here are your account details:</p>
            <section style={codeContainer}>
                <p>
                Email: <span style="font-weight: bold">${email}</span>
                <br />
                Temporary Password:  <span style="font-weight: bold">${password}</span>
                </p>
            </section>
            <p >Please follow these steps to access your account:</p>
            <p >
                1. Visit the admin login page:{" "}
                <a href="${link}" style="">
                Log in here
                </a>
                <br />
                2. Enter your email and the temporary password provided above.
                <br />
                3. You will be prompted to change your password upon first login.
            </p>
            <hr   />
            <p style={footer}>
                For security reasons, please change your password immediately after logging in. If you didn't request this
                account or have any questions, please contact the IT support team immediately.
            </p>
        `,
	};

	await transporter.sendMail(mailOptions);
};

export const sendAccountVerificationOTP = async ({
	email,
	otp,
}: RegistrationLink) => {
	const link = `${environment.CLIENT_URL}/auth/login`;

	const mailOptions = {
		from: environment.EMAIL,
		sender: {
			name: "H&H - House of Flowers",
			address: environment.EMAIL!,
		},
		to: email,
		subject: "Account Verification OTP",
		html: `
            <h1 style={h1}>Verify Your Email Address</h1>
            <p style={text}>Hello,</p>
            <p style={text}>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
            <section style={codeContainer}>
                <p>
                OTP: <span style="font-weight: bold">${otp}</span>
                </p>
            </section>
            <p >Please follow these steps to verify your account:</p>
            <p >
                1. Visit the verification page:{" "}
                <a href="${link}" style="">
                Verify here
                </a>
                <br />
                2. Enter your email and the OTP provided above.
                <br />
                3. Complete the verification process.
            </p>
            <hr   />
            <p style={footer}>
                If you didn't request this verification or have any questions, please contact our support team immediately.
            </p>
        `,
	};

	await transporter.sendMail(mailOptions);
};
