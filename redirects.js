/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from "react";
import { useRouter } from "next/router";
//@ts-ignore
import translationsConfigUser from "../../translations.config.js";
const translationsConfig = {
    defaultLocale: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.defaultLocale) || "en",
    errorPagePath: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.errorPagePath) || "/404",
    componentNameToReplaced: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.componentNameToReplaced) || "TComponent",
    redirectForLoggedUser: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.redirectForLoggedUser) || "/",
    redirectForNoLoggedUser: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.redirectForNoLoggedUser) || "/",
    sitesForLoggedUser: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.sitesForLoggedUser) || [],
    sitedForLoggedAndNotLoggedUser: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.sitedForLoggedAndNotLoggedUser) || [],
    defaultLocaleWithMultirouting: translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.defaultLocaleWithMultirouting,
};
var ERedirect;
(function (ERedirect) {
    ERedirect["siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser"] = "siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser";
    ERedirect["siteForLoggedUser_pathForLoggedUser"] = "siteForLoggedUser_pathForLoggedUser";
    ERedirect["siteForLoggedUser_pathNotForLoggedUser"] = "siteForLoggedUser_pathNotForLoggedUser";
    ERedirect["siteNotForLoggedUser_pathForLoggedUser"] = "siteNotForLoggedUser_pathForLoggedUser";
    ERedirect["siteNotForLoggedUser_pathNotForLoggedUser"] = "siteNotForLoggedUser_pathNotForLoggedUser";
})(ERedirect || (ERedirect = {}));
const checkRedirects = ({ isLoggedUser, path = "", locale, router, }) => {
    var _a;
    const selectedLocale = locale !== null && locale !== void 0 ? locale : (_a = router === null || router === void 0 ? void 0 : router.query) === null || _a === void 0 ? void 0 : _a.locale;
    const defaultLocaleWithMultirouting = translationsConfig.defaultLocaleWithMultirouting;
    const linkLocale = selectedLocale
        ? `/${selectedLocale}`
        : defaultLocaleWithMultirouting
            ? `/${translationsConfig.defaultLocale}`
            : "";
    const redirectLink = `${linkLocale}${linkLocale ? (path === "/" ? "" : path) : path}`;
    const isSiteForLoggedUser = translationsConfig.sitesForLoggedUser.find((itemRoute) => {
        if (!!linkLocale) {
            if (`${linkLocale}${itemRoute === "/" ? "" : itemRoute}` === redirectLink) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (itemRoute === path) {
                return true;
            }
            else {
                return false;
            }
        }
    }) !== undefined;
    const isSiteForLoggedAndNotLoggedUser = translationsConfig.sitedForLoggedAndNotLoggedUser.find((itemRoute) => {
        if (!!linkLocale) {
            if (`${linkLocale}${itemRoute === "/" ? "" : itemRoute}` ===
                redirectLink) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (itemRoute === path) {
                return true;
            }
            else {
                return false;
            }
        }
    }) !== undefined;
    if (isSiteForLoggedAndNotLoggedUser) {
        return {
            value: ERedirect.siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser,
            path: redirectLink,
        };
    }
    if (isLoggedUser) {
        if (isSiteForLoggedUser) {
            return {
                value: ERedirect.siteForLoggedUser_pathForLoggedUser,
                path: redirectLink,
            };
        }
        else {
            const linkRedirectOnSuccess = `${linkLocale}${linkLocale
                ? translationsConfig.redirectForLoggedUser === "/"
                    ? ""
                    : translationsConfig.redirectForLoggedUser
                : translationsConfig.redirectForLoggedUser}`;
            return {
                value: ERedirect.siteForLoggedUser_pathNotForLoggedUser,
                path: linkRedirectOnSuccess,
            };
        }
    }
    else {
        if (isSiteForLoggedUser) {
            const linkRedirectOnFailure = `${linkLocale}${translationsConfig.redirectForNoLoggedUser === "/"
                ? ""
                : translationsConfig.redirectForNoLoggedUser}`;
            return {
                value: ERedirect.siteNotForLoggedUser_pathForLoggedUser,
                path: linkRedirectOnFailure,
            };
        }
        else {
            return {
                value: ERedirect.siteNotForLoggedUser_pathNotForLoggedUser,
                path: redirectLink,
            };
        }
    }
};
const InitializeRedirectsTranslations = ({ isLoggedUser, active = true, }) => {
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady || !active) {
            return;
        }
        const isErrorPage = router.pathname === (translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.errorPagePath);
        if (isErrorPage) {
            return;
        }
        let linkWithoutLocale = "";
        if (router.pathname.includes("[locale]")) {
            const splitPathname = router.pathname.split("/[locale]");
            const selectedPath = splitPathname.at(1);
            if (selectedPath) {
                linkWithoutLocale = selectedPath;
            }
        }
        else {
            linkWithoutLocale = router.pathname;
        }
        const result = checkRedirects({
            isLoggedUser: isLoggedUser,
            locale: undefined,
            path: linkWithoutLocale,
            router: router,
        });
        if (router.asPath !== result.path) {
            router.push(result.path);
        }
        return;
    }, [isLoggedUser, router.asPath, translationsConfig, active]);
};
const validLink = ({ isLoggedUser, path, locale, router }) => {
    const defaultLocaleWithMultirouting = translationsConfig.defaultLocaleWithMultirouting;
    const validLocale = defaultLocaleWithMultirouting
        ? locale
        : translationsConfig.defaultLocale === locale
            ? undefined
            : locale;
    const result = checkRedirects({
        isLoggedUser,
        path,
        locale: validLocale,
        router,
    });
    return result.path;
};
export { InitializeRedirectsTranslations, validLink };
