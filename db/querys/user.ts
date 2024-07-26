import { eq } from "drizzle-orm";
import { db } from "../db";
import { User } from "../schemas";

const bcrypt = require("bcrypt");

export async function getUserByEmail(email:string) {
    return await db.query.User.findFirst({
        where: eq(User.email, email)
    });
};

export async function getUserByID(id:string) {
    return await db.query.User.findFirst({
        columns: {
            id: true,
            name: true,
            email: true
        },
        where: eq(User.id, id)
    });
};

export async function createUser(
    name: string,
    email: string,
    password: string,
    location: [number, number]
) {
    try {
        const salt = await bcrypt.genSalt(10);
        //Hashed pw
        const hashedPw = await bcrypt.hash(password, salt);

        await db.insert(User).values({
            name,
            email,
            password: hashedPw,
            location
        })
    } catch (error) {
        throw error
    }
}