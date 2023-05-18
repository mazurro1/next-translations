import { NextRouter } from "next/router";
type TCheckRedirect = {
    isLoggedUser: boolean;
    path: string;
    locale: string | undefined;
    router: NextRouter;
};
declare const InitializeRedirectsTranslations: ({ isLoggedUser, active, }: {
    isLoggedUser: boolean;
    active: boolean;
}) => void;
declare const validLink: ({ isLoggedUser, path, locale, router }: TCheckRedirect) => string;
export { InitializeRedirectsTranslations, validLink };
