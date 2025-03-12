"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash-es";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { signupAction } from "@/actions/supabase";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    CLIENT_ROUTES,
    EServerResponseCode,
    SignupFormSchema,
    type TSignupFormSchema,
} from "@/lib/constants";
import { createClient } from "@/utils/supabase/client";

export default function SignupForm() {
    const form = useForm<TSignupFormSchema>({
        resolver: zodResolver(SignupFormSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: TSignupFormSchema) {
        try {
            const response = await signupAction(values);

            if (
                isEmpty(response) ||
                response.code !== EServerResponseCode.SUCCESS
            ) {
                alert("Failed to signup!");
            } else {
                form.reset();
                alert(response.message);
            }
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Failed to signup!");
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
            console.error(error);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-32">
            <CardHeader>
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your information to get started.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
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
                                    <FormDescription>
                                        Enter a valid email
                                    </FormDescription>
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
                                            placeholder="Create a password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Must be at least 8 characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Retype the password again"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Must be same as the password
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit">
                            Sign up
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
                            className="w-full"
                            type="button"
                            variant="outline"
                            onClick={() => signInWithGoogle()}
                        >
                            <Mail className="mr-2" size={16} />
                            Sign up with Google
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a
                        className="text-primary font-medium hover:underline"
                        href={CLIENT_ROUTES.LOGIN}
                    >
                        Sign in
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
}
