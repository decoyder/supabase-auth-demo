"use client";

import { useRouter } from "next/navigation";

import { signOutAction } from "@/actions/supabase";
import { Button } from "@/components/ui/button";
import { CLIENT_ROUTES } from "@/lib/constants";

export default function DashboardPage() {
    const router = useRouter();

    async function onLogout() {
        try {
            await signOutAction();
            router.push(CLIENT_ROUTES.LOGIN);
        } catch (error) {
            alert("Some error occured");
            console.error(error);
        }
    }

    return (
        <div className="mt-32 text-center">
            {`This is a protected dashboard page. You can only view this page when
            you're logged in.`}
            <form action={onLogout} className="mt-4">
                <Button>Logout</Button>
            </form>
        </div>
    );
}
