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

import {
    TForgotPasswordFormSchema,
    ForgotPasswordFormSchema,
    CLIENT_ROUTES,
    EServerResponseCode,
} from "@/lib/constants";
import { forgotPasswordAction } from "@/actions/supabase";
import { isEmpty } from "lodash-es";

export default function ForgotPasswordForm() {
    const form = useForm<TForgotPasswordFormSchema>({
        resolver: zodResolver(ForgotPasswordFormSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: TForgotPasswordFormSchema) {
        try {
            const response = await forgotPasswordAction(values);

            if (
                isEmpty(response) ||
                response.code !== EServerResponseCode.SUCCESS
            ) {
                alert("Failed to send verification link. Please try again");
            } else {
                alert("Verification link send. Please check your email");
                form.reset();
            }
        } catch (error) {
            console.error("Forgot password failed:", error);
            alert("Failed to send verification link. Please try again");
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-32">
            <CardHeader>
                <CardTitle className="text-2xl">Forgot password</CardTitle>
                <CardDescription>
                    Enter your email to get a verification link
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
                        <Button type="submit" className="w-full">
                            Send Email
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
                <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <a
                        href={CLIENT_ROUTES.LOGIN}
                        className="text-primary font-medium hover:underline"
                    >
                        Sign in
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
}
