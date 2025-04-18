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

export const AuthValidation = {
    SignUpByEmailAndPasswordValidationSchema,
    loginValidationSchema
};