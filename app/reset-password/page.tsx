"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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

import {
    TResetPasswordFormSchema,
    ResetPasswordFormSchema,
    CLIENT_ROUTES,
    EServerResponseCode,
} from "@/lib/constants";
import { resetPasswordAction } from "@/actions/supabase";
import { isEmpty } from "lodash-es";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
    const router = useRouter();

    const form = useForm<TResetPasswordFormSchema>({
        resolver: zodResolver(ResetPasswordFormSchema),
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: TResetPasswordFormSchema) {
        try {
            const response = await resetPasswordAction(values);

            if (
                isEmpty(response) ||
                response.code !== EServerResponseCode.SUCCESS
            ) {
                alert(response.message);
                console.log(response.error);
            } else {
                form.reset();
                alert(response.message);
                router.push(CLIENT_ROUTES.DASHBOARD);
            }
        } catch (error) {
            console.error("Password reset error:", error);
            alert("Password reset failed! Please try again");
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-32">
            <CardHeader>
                <CardTitle className="text-2xl">Reset password</CardTitle>
                <CardDescription>Create a new password</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
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
                        <Button type="submit" className="w-full">
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
