"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { loginAction } from "@/actions/supabase";
import {
    CLIENT_ROUTES,
    EServerResponseCode,
    LoginFormSchema,
    TLoginFormSchema,
} from "@/lib/constants";
import { createClient } from "@/utils/supabase/client";
import { isEmpty } from "lodash-es";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
    const form = useForm<TLoginFormSchema>({
        resolver: zodResolver(LoginFormSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: TLoginFormSchema) {
        try {
            const response = await loginAction(values);

            if (
                !isEmpty(response) &&
                response.code === EServerResponseCode.FAILURE
            ) {
                alert(response.message);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    }

    const searchParams = useSearchParams();
    const next = searchParams.get("next");
    const supabase = createClient();
    async function signInWithGoogle() {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback${
                        next ? `?next=${encodeURIComponent(next)}` : ""
                    }`,
                },
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            alert("There was an error logging in with Google."),
                console.error(error);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-32">
            <CardHeader>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                    Sign in to your account to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="you@example.com"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-end">
                            <Button
                                variant="link"
                                className="px-0 font-normal"
                                type="button"
                            >
                                <a
                                    href={CLIENT_ROUTES.FORGOT_PASSWORD}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </Button>
                        </div>
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>

                        <div className="relative my-4">
                            <Separator />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-background px-2 text-xs text-muted-foreground">
                                    OR CONTINUE WITH
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => signInWithGoogle()}
                        >
                            <Mail size={16} className="mr-2" />
                            Sign in with Google
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a
                        href={CLIENT_ROUTES.SIGNUP}
                        className="text-primary font-medium hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
}
