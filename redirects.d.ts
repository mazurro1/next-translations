import { NextRouter } from "next/router";
type T_ValidLinks = {
    isLoggedUser: boolean;
    path?: string;
    locale?: string;
    router: NextRouter;
    query?: string;
    hash?: string;
};
declare const InitializeRedirectsTranslations: ({ isLoggedUser, enable, withQuery, withHash, }: {
    isLoggedUser: boolean;
    enable: boolean;
    withQuery?: boolean | undefined;
    withHash?: boolean | undefined;
}) => void;
declare const validLink: ({ isLoggedUser, path, locale, router, query, hash, }: T_ValidLinks) => string;
export { InitializeRedirectsTranslations, validLink };
