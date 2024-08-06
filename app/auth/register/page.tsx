"use client";

import { Coordinate } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

function RegisterPage() {
    const [userLocation, setUserLocation] = useState<Coordinate | null>(null);

    const router = useRouter();

    const getLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        navigator.geolocation.getCurrentPosition((pos) => {
            setUserLocation({
                long: pos.coords.longitude,
                lat: pos.coords.latitude
            })
        },
            (error) => {
                alert(error.message)
            },
            {enableHighAccuracy: true}
        )
    }

    async function handleSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const name = formData.get("name");
        const password = formData.get("password");
        const password2 = formData.get("password2");

        if (password !== password2) {
            alert("Password don't match")
            return;
        }

        if (userLocation === null) {
            alert("Please enter your location")
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                name,
                location: [userLocation?.long, userLocation?.lat]
            })
        })

        if (res.status === 201) {
            router.push("/auth/login")
            router.refresh()
        } else {
            alert("Register Failed")
        }
    }

    return (
        <main className="h-screen flex items-center justify-center">
            <div
                className="flex flex-col items-center h-4/5 w-4/5 md:w-2/5"
            >
                <h1
                    className="text-center text-6xl font-medium mb-5"
                >
                    Register
                </h1>

                <form
                    className="flex flex-col w-11/12 p-2 bg-slate-200 rounded-xl"
                    onSubmit={handleSubmit}
                >
                    <label htmlFor="name">Username</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                    />
                    <div>
                        <label>Location</label>
                        <p>{userLocation === null ?
                            <button onClick={getLocation}>Get your location</button>
                            :
                            `${userLocation.lat}, ${userLocation.long}`
                        }
                        </p>
                    </div>

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                    />

                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        id="password2"
                        type="password"
                        name="password2"
                        placeholder="Confirm your password"
                        required
                    />

                    <div
                        className="mt-3 flex flex-row items-center justify-end"
                    >
                        <p>
                            Already have an account? <Link href={"/auth/login"} className="mr-3 text-blue-400">Login</Link>
                        </p>
                        <button
                            type="submit"
                            className="w-21 p-1 text-xl font-medium rounded-md bg-sky-400 hover:bg-sky-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default RegisterPage;