// Auth Management

import { z } from "zod";

export const SignupFormSchema = z
    .object({
        email: z.string().email({
            message: "Please enter a valid email address.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export const LoginFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export const ForgotPasswordFormSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export const ResetPasswordFormSchema = z
    .object({
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
    });

export type TSignupFormSchema = z.infer<typeof SignupFormSchema>;
export type TLoginFormSchema = z.infer<typeof LoginFormSchema>;
export type TForgotPasswordFormSchema = z.infer<
    typeof ForgotPasswordFormSchema
>;
export type TResetPasswordFormSchema = z.infer<typeof ResetPasswordFormSchema>;

export const CLIENT_ROUTES = {
    HOME: "/",

    // app
    DASHBOARD: "/dashboard",
    RESET_PASSWORD: "/reset-password",

    // auth
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
};

export const PROTECTED_ROUTES = [
    CLIENT_ROUTES.DASHBOARD,
    CLIENT_ROUTES.RESET_PASSWORD,
];

export enum EServerResponseCode {
    SUCCESS,
    FAILURE,
}
