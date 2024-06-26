import { getUserByEmail } from "@/db/querys/user";
import { getSecretKey } from "@/utils/jwt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const bcrypt = require("bcrypt");

interface LoginForm{
    email: string;
    password: string;
}

export async function POST(req: Request) {
    try {
        const body: LoginForm = await req.json();
        
        //GET user
        const user = await getUserByEmail(body.email);
        if (!user) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), {
                status: 400
            })
        }

        const isPasswordValid = await bcrypt.compare(body.password, user.password);
        if (!isPasswordValid) {
            return new NextResponse(JSON.stringify({ error: "Invalid password" }), {
                status: 401
            })
        }

        const accessToken = await new SignJWT({
            username: user.name,
            id: user.id
        }).setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("600s")
            .sign(getSecretKey());
        
        const refreshToken = await new SignJWT({
            username: user.name,
            id: user.id
        }).setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1 day")
            .sign(getSecretKey());

        const response = new NextResponse(JSON.stringify({ message: "Login successful" }), {
            status: 200
        })

        response.cookies.set({
            name: "accessToken",
            value: accessToken,
            path: "/"
        })

        response.cookies.set({
            name: "refreshToken",
            value: refreshToken,
            path: "/"
        })

        return response
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Server error" }), {
			status: 500
		})
    }
}