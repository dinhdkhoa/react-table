import envConfig from "@/config"
import { LoginResType } from "@/schemaValidations/auth.schema"
import { RedirectType, redirect } from "next/navigation"
import { toast } from "sonner"

type CustomRequest = RequestInit & { baseUrl?: string | undefined }

const FORM_ERROR_STATUS = 422
const UNAUTHORIZED_ERROR_STATUS = 401

type FormErrorPayload = {
    message: string,
    errors: {
        field: string,
        message: string
    }[]
}

export class HttpError extends Error {
    status: number
    payload: {
        message: string,
        [key: string] :any
    }

    constructor({ status, payload }: { status: number, payload: any }) {
        super(payload.message)
        this.status = status
        this.payload = payload
    }
}

export class FormError extends HttpError {
    status: 422
    payload: FormErrorPayload

    constructor({ status, payload }: { status: 422, payload: FormErrorPayload }) {
        super({ status: 422, payload: payload })
        this.status = status
        this.payload = payload
    }
}

class SessionToken {
    private token = ''
    private _expiresAt = ''
    get value() { 
        return this.token
    }
    set value(token: string) {
        // Nếu gọi method này ở server thì sẽ bị lỗi
        if (!isClient()) {
            throw new Error('Cannot set token on server side')
        }
        this.token = token
    }

    get expiresAt() {
        return this._expiresAt
    }
    set expiresAt(expireAt: string) {
        // Nếu gọi method này ở server thì sẽ bị lỗi
        if (!isClient()) {
            throw new Error('Cannot set _expiresAt on server side')
        }
        this._expiresAt = expireAt
 }

}
/**
 *  chỉ lấy đc ở client, với server 
 * nếu muốn có gắn sessionToken vào header phải lấy từ cookies() - next/headers
 */
export const clientSessionToken = new SessionToken()

const request = async <ResponseType>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomRequest | undefined) => {
    const body = options?.body ? (isFormData(options.body) ? options.body : JSON.stringify(options.body)) : undefined
    
    const baseHeader = isFormData(body) ? {
        Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : ''
    } : {
        'Content-Type': 'application/json',
        Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : ''
    }

    //Nếu không có options.baseUrl (hoặc = undefined) thì lấy gọi đến env 
    //Còn nếu '' thì gọi nextjs server hoặc gọi đến giá trị của baseUrl
    const baseURL = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
    const fullURL = url.startsWith('/') ? `${baseURL}${url}` : `${baseURL}/${url}`

    const res = await fetch(fullURL, {
        ...options,
        headers: {
            ...baseHeader as any,
            ...options?.headers,
        },
        body,
        method
    })

    const payload: ResponseType = await res.json()

    const data = {
        status: res.status,
        payload
    }
    //interceptors 

    if (!res.ok) {
        if (res.status == FORM_ERROR_STATUS){
            throw new FormError({
                status: 422,
                payload: data.payload as FormErrorPayload
            })
        } else if (res.status == UNAUTHORIZED_ERROR_STATUS) {
            if (isClient()) {
                await handleUnthorizedResponseOnClient(baseHeader as any)
            } else {
                const paramSessionToken = (options?.headers as any)?.Authorization.split('Bearer ').pop() as string
                redirect(`/logout?sessionToken=${paramSessionToken}`)
            }
        } else {
            throw new HttpError(data)
        }
    }

    if(isClient()){
        if (url === 'auth/login' || url === 'auth/register') {
            clientSessionToken.value = (payload as LoginResType).data.token;
            clientSessionToken.expiresAt = (payload as LoginResType).data.expiresAt;
        } else if (url === 'auth/logout') {
            clientSessionToken.value = '';
            clientSessionToken.expiresAt = new Date().toUTCString()
        }
    }

    return data
}

const isClient = (): boolean => {
    return typeof window !== 'undefined'
}

const isFormData = (body: BodyInit | null | undefined ) => {
    return body && body instanceof FormData
}

const handleUnthorizedResponseOnClient = async (baseHeader: HeadersInit | undefined) : Promise<void | string> => {
   // handle 401 on client
        await fetch('api/auth/logout', 
            {
                method: 'POST',
                body: JSON.stringify({
                    sessionExpired: true
                }),
                headers: {
                    ...baseHeader
                }
            }
        )
        clientSessionToken.value = '';
        clientSessionToken.expiresAt = '';
        location.href = '/login?sessionExpired=true'
}

const http = {
    get: <T>(url: string, options?: Omit<CustomRequest, 'body'>) => request<T>('GET', url, { ...options }),
    post: <T>(url: string, body: any, options?: Omit<CustomRequest, 'body'>) => request<T>('POST', url, { ...options, body }),
    put: <T>(url: string, body: any, options?: Omit<CustomRequest, 'body'>) => request<T>('PUT', url, { ...options, body }),
    delete: <T>(url: string, body?: any, options?: Omit<CustomRequest, 'body'>) => request<T>('DELETE', url, { ...options, body })
}
export default http