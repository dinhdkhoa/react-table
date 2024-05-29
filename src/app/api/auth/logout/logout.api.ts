import http from "@/lib/https"
import { MessageResType } from "@/schemaValidations/common.schema"

const logoutAPI = {

    logoutServer: (sessionToken: string) =>
        http.post<MessageResType>('auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${sessionToken}`
            }
        }),
    logoutClient: (sessionExpired?: boolean, signal?: AbortSignal) => http.post<MessageResType>('api/auth/logout', {
        sessionExpired,
        signal
    }, { baseUrl: '' })

}

export default logoutAPI