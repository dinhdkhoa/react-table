import { decodeJWT } from "@/lib/utils";
import { cookies } from "next/headers"
import slideSessionAPI from "./silde-session.api";
import logoutAPI from "../logout/logout.api";
import { HttpError } from "@/lib/https";

export async function POST(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get("sessionToken")?.value

    if (!token) {
        return Response.json({
            message: 'No Token Found'
        }, {
            status: 400,
        })
    }

    try {
        const result = await slideSessionAPI.slideSession(token)
        if (result) {
            const expiresTime = new Date(result.payload.data.expiresAt).toUTCString();
            return Response.json(result.payload, {
                status: 200,
                headers: { 'Set-Cookie': `sessionToken=${token};  Path=/; HttpOnly; Expires=${expiresTime}; Secure; SameSite=Lax;` },
            })
        }
    } catch (error) {
        const result = await logoutAPI.logoutServer(token)
        if (result) {
            return Response.json(result.payload, {
                status: 200,
                headers: { 'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0` },
            })
        } else if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            })
        } else {
            return Response.json({
                message: 'Unknown Error'
            }, {
                status: 500
            })
        }
    }

   
}