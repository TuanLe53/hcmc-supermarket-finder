"use client";

import Link from "next/link";
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
        <main className="h-screen flex items-center justify-center">
            <div
                className="flex flex-col items-center h-4/5 xl:w-2/5 md:w-4/5"
            >
                <h1
                    className="text-center text-6xl font-medium mb-5"
                >
                    Login
                </h1>

                <form
                    className="flex flex-col w-11/12 p-2 bg-slate-200 rounded-xl"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your user's email"
                        className="mb-3"
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
                    <div
                        className="mt-3 flex flex-row items-center justify-end"
                    >
                        <Link
                            href={"/auth/register"}
                            className="mr-3 text-blue-400"
                        >
                            Register
                        </Link>
                        <button
                            type="submit"
                            className="w-20 p-1 text-xl font-medium rounded-md bg-sky-400 hover:bg-sky-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}