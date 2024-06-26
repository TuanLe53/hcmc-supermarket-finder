"use client";

import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

interface Coordinate{
    long: number,
    lat: number
}

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
        <main>
            <h1>Register page</h1>
            <form onSubmit={handleSubmit}>
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

                <label>Address</label>
                <button onClick={getLocation}>GPS</button>
                <p>{userLocation === null ? "Enter your location" : `${userLocation.lat}, ${userLocation.long}`}</p>

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
                <button type="submit">Register</button>
            </form>
        </main>
    )
}

export default RegisterPage;