import http from "@/lib/https";
import { LoginBodyType, LoginResType, SlideSessionResType } from "@/schemaValidations/auth.schema";

const slideSessionAPI = {
    slideSession: (sessionToken: string) => http.post<SlideSessionResType>('auth/slide-session', {}, {
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    }),
    slideSessionClient: () => http.post<SlideSessionResType>('api/auth/slide-session', {}, { baseUrl: ''})
}

export default slideSessionAPI