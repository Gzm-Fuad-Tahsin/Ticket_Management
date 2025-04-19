import { z } from "zod";


const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

const SignUpByEmailAndPasswordValidationSchema = z.object({
    body: z.object({
        userName: z.string({ required_error: "Name is required" }),
        email: z.string().email("Invalid email address"),
        password: z
            .string({
                invalid_type_error: 'Password must be string',
            })
            .min(6, { message: 'password must be at least 6 character' })

    })
})

const ChangePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({ required_error: 'Old Password is required' }),
        newPassword: z.string({ required_error: 'New Password is required' }),
    }),
});

const ChangeNameValidationSchema = z.object({
    body: z.object({
        userName: z.string({ required_error: 'Name is required' }),
        
    }),
});
const getAccessTokenByRefreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({ required_error: 'refresh token is required' }),
    }),
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }),
    }),
});
const verifyOTPValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }),
        OTP : z.string({required_error : 'OTP is required'})
    }),
});
const resetPasswordValidationSchema = z.object({
    cookies: z.object({
        verifiedUser: z.string({ required_error: 'verification token is required' }),
    }),
    body: z.object({
        newPassword: z.string({ required_error: 'Password is required' }),
    }),
});

const PinValidationSchema = z.object({
    body: z.object({
        PIN : z.string({required_error : 'Pin is required'})
    }),
});


const PurchaseTicketValidationSchema = z.object({
    body: z.object({
        bus_id: z.string({ required_error: 'bus_id is required' }),
        service_id: z.string({ required_error: 'service_id is required' }),
        seat_number: z.string({ required_error: 'seat_number is required' }),
    }),
});

export const UserValidation = {
    SignUpByEmailAndPasswordValidationSchema,
    loginValidationSchema,
    getAccessTokenByRefreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    ChangePasswordValidationSchema,
    verifyOTPValidationSchema,
    resetPasswordValidationSchema,
    PinValidationSchema,
    ChangeNameValidationSchema,

    PurchaseTicketValidationSchema
};
