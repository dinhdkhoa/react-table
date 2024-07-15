import { cookies } from 'next/headers'
import logoutAPI from './logout.api'
import { HttpError } from '@/lib/https'

//Nếu dùng cookie thì đảm bảo phải có httpOnly ở src\app\api\auth\route.ts:15,
//và xoá cookie ở dòng 27
//make sure là dùng xử lí xoá clientSessionToken ở interceptors http.ts:105

export async function POST(request: Request) {
  const req = await request.json()
  const sessionExpired: boolean | undefined = req.sessionExpired
  const signal: AbortController | undefined = req.signal
  if (sessionExpired) {
    return Response.json(
      {
        message: 'Session Expired. Please log in again!'
      },
      {
        status: 200,
        headers: { 'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0` }
      }
    )
  }
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('sessionToken')?.value

  if (!sessionToken) {
    return Response.json(
      {
        message: 'No Token Found'
      },
      {
        status: 400
      }
    )
  }

  try {
    const result = await logoutAPI.logoutServer(sessionToken)
    if (result) {
      return Response.json(result.payload, {
        status: 200,
        headers: { 'Set-Cookie': `sessionToken=; Path=/; HttpOnly; Max-Age=0` }
      })
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Unknown Error'
        },
        {
          status: 500
        }
      )
    }
  }
}
