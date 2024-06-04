import { IAuthenticationPresenter } from '@/presentation/Authentication/authenticationPresenter.interface';
import { PresentationModuleSymbols } from '@/presentation/PresentationModuleSymbols';


import { useRouter } from 'next/navigation';
import { inject } from '../common/inject';

// import { useAuthentication } from 'ui/shared/Application/Authentication/authentication.hooks';
// import { APP_ROUTES } from 'ui/common/navigation/routes';
// import {
//   LOGIN_FIELD,
//   PASSWORD_FIELD,
// } from 'ui/Login/components/LoginForm/loginForm.consts';

const { authenticate } = inject<IAuthenticationPresenter>(
    PresentationModuleSymbols.AUTHENTICATION_PRESENTER
);

type UseLoginForm = {
    onSubmit: (formData: FormData) => void;
};


export const useLoginForm = (): UseLoginForm => {
    //   const { logIn } = useAuthentication();
    const router = useRouter();

    const onSubmit = async (formData: FormData) => {
        const email = (formData.get('email') as string) || '';
        const password = (formData.get('password') as string) || '';

        const result = await authenticate({
            email,
            password,
        });

        const a = "";
        // if (result.ok) {
        // //   router.push(APP_ROUTES.HOME);
        // }
    };

    return {
        onSubmit,
    };
};
