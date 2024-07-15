import { decodeJWT } from '@/lib/utils'

export async function POST(request: Request) {
  const body = await request.json()
  const token = body.sessionToken
  if (!token) {
    return Response.json(
      {
        message: 'No Token Found'
      },
      {
        status: 400
      }
    )
  }
  const expiresTime = new Date(body.expiresAt).toUTCString()
  return Response.json(body, {
    status: 200,
    headers: { 'Set-Cookie': `sessionToken=${token};  Path=/; HttpOnly; Expires=${expiresTime}; Secure; SameSite=Lax;` }
  })
}
