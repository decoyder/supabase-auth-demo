"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CLIENT_ROUTES, EServerResponseCode } from "@/lib/constants";
import {
    ForgotPasswordFormSchema,
    ResetPasswordFormSchema,
    SignupFormSchema,
    type TForgotPasswordFormSchema,
    type TLoginFormSchema,
    type TResetPasswordFormSchema,
    type TSignupFormSchema,
} from "@/lib/constants";
import { createClient } from "@/utils/supabase/server";

export const signupAction = async (formData: TSignupFormSchema) => {
    const { email, password } = formData;

    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const validation = SignupFormSchema.safeParse(formData);

    if (!validation.success) {
        return {
            code: EServerResponseCode.FAILURE,
            error: validation.error,
            message: "Signup failed",
        };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error.code + " " + error.message);

        return {
            code: EServerResponseCode.FAILURE,
            error,
            message: "Something went wrong! Please try again",
        };
    } else {
        return {
            code: EServerResponseCode.SUCCESS,
            message:
                "Signup successful! Please check your mail to confirm your account",
        };
    }
};

export const loginAction = async (formData: TLoginFormSchema) => {
    const { email, password } = formData;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error(error.code + " " + error.message);

        return {
            code: EServerResponseCode.FAILURE,
            error,
            message: "Invalid credentials",
        };
    } else {
        redirect(CLIENT_ROUTES.DASHBOARD);
    }
};

export const forgotPasswordAction = async (
    formData: TForgotPasswordFormSchema,
) => {
    const { email } = formData;
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const validation = ForgotPasswordFormSchema.safeParse(formData);

    if (!validation.success) {
        return {
            code: EServerResponseCode.FAILURE,
            error: validation.error,
            message: "Password reset failed! Please try again",
        };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/${CLIENT_ROUTES.RESET_PASSWORD}`,
    });

    if (error) {
        console.error(error.code + " " + error.message);

        return {
            code: EServerResponseCode.FAILURE,
            error,
            message: "Something went wrong! Please try again",
        };
    } else {
        return {
            code: EServerResponseCode.SUCCESS,
            message: "Success! Please check your mail to reset your password",
        };
    }
};

export const resetPasswordAction = async (
    formData: TResetPasswordFormSchema,
) => {
    const supabase = await createClient();
    const { password } = formData;

    const validation = ResetPasswordFormSchema.safeParse(formData);

    if (!validation.success) {
        return {
            code: EServerResponseCode.FAILURE,
            error: validation.error,
            message: "Password reset failed! Please try again",
        };
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return {
            code: EServerResponseCode.FAILURE,
            error,
            message: "Something went wrong! Please try again",
        };
    } else {
        return {
            code: EServerResponseCode.SUCCESS,
            message: "Password changed successfully",
        };
    }
};

export const signOutAction = async () => {
    try {
        const supabase = await createClient();

        await supabase.auth.signOut();

        return {
            code: EServerResponseCode.SUCCESS,
            message: "User logged out successfully!",
        };
    } catch (error) {
        console.error(error);

        return {
            code: EServerResponseCode.FAILURE,
            message: "Failed to logout! Please try again",
        };
    }
};
