import { createUser, getUserByEmail } from "@/db/querys/user";
import { NextResponse } from "next/server";

interface RegisterForm{
    name: string;
    email: string;
    address: string | null;
    password: string;
    location: [number, number];
}

export async function POST(req: Request) {
    try {
        const body: RegisterForm = await req.json();
        
        //Check if email exists
        const isEmailExists = await getUserByEmail(body.email);
        if (isEmailExists) {
            return new NextResponse(JSON.stringify({ error: "Email already exists" }), {
                status: 400
            })
        }

        //Create user
        await createUser(body.name, body.email, body.password, body.location);

        return new NextResponse(JSON.stringify({ message: "User created. Please login" }), {
            status: 201
        })
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ error: "Server error" }), {
            status: 500
        })
    }
}