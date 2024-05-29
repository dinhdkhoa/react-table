import {divData } from '@/lib/divData.json'

export async function GET() {
    return Response.json(divData, {
        status: 200,
    })
}