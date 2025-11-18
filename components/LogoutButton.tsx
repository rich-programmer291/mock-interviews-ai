"use client";

import { logoutAction } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { Button } from "./ui/button";

const LogoutButton = () => {
    const router = useRouter();

    async function handleLogout() {
        await signOut(auth);
        await logoutAction();

        router.replace("/sign-in");
    }

    return (
        <div>
            <Button onClick={handleLogout}
            className="cursor-pointer bg-primary-200 hover:bg-white hover:scale-110"
            >Logout</Button>
        </div>
    )
}

export default LogoutButton