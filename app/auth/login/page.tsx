"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Login() {
    const router = useRouter();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email, password})
        })

        if (res.status === 200) {
            router.push("/")
            router.refresh()
        } else {
            const data = await res.json();
            alert(data.error)
        }
    }

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your user's email"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </main>
    )
}