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
    redirectForNotLoggedUser: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.redirectForNotLoggedUser) || "/",
    sitesForLoggedUser: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.sitesForLoggedUser) || [],
    sitedForLoggedAndNotLoggedUser: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.sitedForLoggedAndNotLoggedUser) || [],
    defaultLocaleWithMultirouting: translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.defaultLocaleWithMultirouting,
};
var E_Redirect;
(function (E_Redirect) {
    E_Redirect["siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser"] = "siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser";
    E_Redirect["siteForLoggedUser_pathForLoggedUser"] = "siteForLoggedUser_pathForLoggedUser";
    E_Redirect["siteForLoggedUser_pathNotForLoggedUser"] = "siteForLoggedUser_pathNotForLoggedUser";
    E_Redirect["siteNotForLoggedUser_pathForLoggedUser"] = "siteNotForLoggedUser_pathForLoggedUser";
    E_Redirect["siteNotForLoggedUser_pathNotForLoggedUser"] = "siteNotForLoggedUser_pathNotForLoggedUser";
})(E_Redirect || (E_Redirect = {}));
const validLinkWithLocale = (locale, path) => {
    if (locale) {
        return `${locale}${path === "/" ? "" : path}`;
    }
    else {
        return `${path}`;
    }
};
const addQueryAndHashToLink = (link, query, hash) => {
    if (query && hash) {
        return `${link === "" ? "/" : link}?${query}#${hash}`;
    }
    else if (query) {
        return `${link === "" ? "/" : link}?${query}`;
    }
    else if (hash) {
        return `${link === "" ? "/" : link}#${hash}`;
    }
    else {
        return link;
    }
};
const checkRedirects = ({ isLoggedUser, path = "", locale, router, query = "", hash = "", }) => {
    var _a, _b, _c;
    const defaultLocaleWithMultirouting = translationsConfig.defaultLocaleWithMultirouting;
    const defaultLocale = translationsConfig.defaultLocale;
    let selectedLocale = locale !== null && locale !== void 0 ? locale : (_a = router === null || router === void 0 ? void 0 : router.query) === null || _a === void 0 ? void 0 : _a.locale;
    if (!defaultLocaleWithMultirouting) {
        if (defaultLocale === locale) {
            selectedLocale = undefined;
        }
    }
    const linkLocale = selectedLocale
        ? `/${selectedLocale}`
        : defaultLocaleWithMultirouting
            ? `/${defaultLocale}`
            : "";
    const redirectLink = addQueryAndHashToLink(validLinkWithLocale(linkLocale, path), query, hash);
    const isSiteForLoggedUser = ((_b = translationsConfig.sitesForLoggedUser) === null || _b === void 0 ? void 0 : _b.find((itemRoute) => {
        if (!!linkLocale) {
            if (validLinkWithLocale(linkLocale, itemRoute) === redirectLink) {
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
    })) !== undefined;
    const isSiteForLoggedAndNotLoggedUser = ((_c = translationsConfig.sitedForLoggedAndNotLoggedUser) === null || _c === void 0 ? void 0 : _c.find((itemRoute) => {
        if (!!linkLocale) {
            if (validLinkWithLocale(linkLocale, itemRoute) === redirectLink) {
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
    })) !== undefined;
    if (isSiteForLoggedAndNotLoggedUser) {
        return {
            value: E_Redirect.siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser,
            path: redirectLink,
        };
    }
    if (isLoggedUser) {
        if (isSiteForLoggedUser) {
            return {
                value: E_Redirect.siteForLoggedUser_pathForLoggedUser,
                path: redirectLink,
            };
        }
        else {
            const linkRedirectOnSuccess = addQueryAndHashToLink(validLinkWithLocale(linkLocale, translationsConfig.redirectForLoggedUser), query, hash);
            return {
                value: E_Redirect.siteForLoggedUser_pathNotForLoggedUser,
                path: linkRedirectOnSuccess,
            };
        }
    }
    else {
        if (isSiteForLoggedUser) {
            const linkRedirectOnFailure = addQueryAndHashToLink(validLinkWithLocale(linkLocale, translationsConfig.redirectForNotLoggedUser), query, hash);
            return {
                value: E_Redirect.siteNotForLoggedUser_pathForLoggedUser,
                path: linkRedirectOnFailure,
            };
        }
        else {
            return {
                value: E_Redirect.siteNotForLoggedUser_pathNotForLoggedUser,
                path: redirectLink,
            };
        }
    }
};
const InitializeRedirectsTranslations = ({ isLoggedUser, enable = true, withQuery = true, withHash = true, }) => {
    const router = useRouter();
    useEffect(() => {
        if (!router.isReady || !enable) {
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
            else {
                linkWithoutLocale = "/";
            }
        }
        else {
            linkWithoutLocale = router.pathname;
        }
        let queryValue = "";
        if (withQuery) {
            if (window.location.search.length > 0) {
                const splitQuery = window.location.search.split("?");
                const getQueryValue = splitQuery.at(1);
                if (getQueryValue) {
                    queryValue = getQueryValue;
                }
            }
        }
        let hashValue = "";
        if (withHash) {
            if (window.location.hash.length > 0) {
                const splitHash = window.location.hash.split("#");
                const getHashValue = splitHash.at(1);
                if (getHashValue) {
                    hashValue = getHashValue;
                }
            }
        }
        const result = checkRedirects({
            isLoggedUser: isLoggedUser,
            locale: undefined,
            path: linkWithoutLocale,
            router: router,
            query: queryValue,
            hash: hashValue,
        });
        if (router.asPath !== result.path) {
            router.push(result.path);
        }
        return;
    }, [isLoggedUser, router.asPath, translationsConfig, enable]);
};
const validLink = ({ isLoggedUser, path, locale, router, query = "", hash = "", }) => {
    let linkWithoutLocale = path;
    if (!linkWithoutLocale) {
        if (router.pathname.includes("[locale]")) {
            const splitPathname = router.pathname.split("/[locale]");
            const selectedPath = splitPathname.at(1);
            if (selectedPath) {
                linkWithoutLocale = selectedPath;
            }
            else {
                linkWithoutLocale = "/";
            }
        }
        else {
            linkWithoutLocale = router.pathname;
        }
    }
    const result = checkRedirects({
        isLoggedUser,
        path: linkWithoutLocale,
        locale: locale,
        router,
        query,
        hash,
    });
    return result.path;
};
export { InitializeRedirectsTranslations, validLink };
