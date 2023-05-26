import { NextRouter } from "next/router";
type TValidLinks = {
    isLoggedUser: boolean;
    path?: string;
    locale: string | undefined;
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
declare const validLink: ({ isLoggedUser, path, locale, router, query, hash, }: TValidLinks) => string;
export { InitializeRedirectsTranslations, validLink };
