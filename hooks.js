/* eslint-disable @typescript-eslint/no-explicit-any */
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
};
let pageTranslations = null;
const resolvePath = (object, path, defaultValue = undefined) => path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);
const initializeTranslations = (translations) => {
    pageTranslations = translations;
};
const InitializeRedirectsTranslations = ({ isLoggedUser, }) => {
    const router = useRouter();
    useEffect(() => {
        var _a;
        if (isLoggedUser === undefined || !router.isReady) {
            return;
        }
        const actualPath = router.route;
        const selectedLocale = (_a = router === null || router === void 0 ? void 0 : router.query) === null || _a === void 0 ? void 0 : _a.locale;
        const isLinkWithLocale = !!selectedLocale;
        const linkLocale = selectedLocale ? `/${selectedLocale}` : "";
        let linkWithoutLocale = "";
        if (router.pathname.includes("[locale]")) {
            const splitPathname = router.pathname.split("/[locale]");
            linkWithoutLocale = splitPathname.at(1);
        }
        else {
            linkWithoutLocale = router.pathname;
        }
        const redirectLink = `${linkLocale}${linkWithoutLocale}`;
        const isErrorPage = router.pathname === (translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.errorPagePath);
        const isSiteForLoggedUser = translationsConfig.sitesForLoggedUser.find((itemRoute) => {
            if (isLinkWithLocale) {
                if (`${linkLocale}${itemRoute === "/" ? "" : itemRoute}` ===
                    redirectLink) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (itemRoute === linkWithoutLocale) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }) !== undefined;
        if (isLoggedUser) {
            if (isSiteForLoggedUser) {
                if (!isLinkWithLocale) {
                    if (redirectLink !== actualPath) {
                        if (!isErrorPage) {
                            router.push(redirectLink);
                        }
                    }
                }
                return;
            }
            else {
                const linkRedirectOnSuccess = `${linkLocale}${translationsConfig.redirectForLoggedUser}`;
                if (actualPath !== linkRedirectOnSuccess) {
                    if (!isErrorPage) {
                        router.push(linkRedirectOnSuccess);
                    }
                }
                return;
            }
        }
        else {
            if (isSiteForLoggedUser) {
                const linkRedirectOnFailure = `${linkLocale}${translationsConfig.redirectForNoLoggedUser}`;
                if (actualPath !== linkRedirectOnFailure) {
                    if (!isErrorPage) {
                        router.push(linkRedirectOnFailure);
                    }
                }
                return;
            }
            else {
                if (!isLinkWithLocale) {
                    if (redirectLink !== actualPath) {
                        if (!isErrorPage) {
                            router.push(redirectLink);
                        }
                    }
                }
                return;
            }
        }
    }, [isLoggedUser, router.asPath]);
};
const checkTypesAndReturn = (type, value) => {
    if (type === "string") {
        if (typeof value === "string") {
            return value;
        }
        else {
            return undefined;
        }
    }
    else if (type === "number") {
        if (typeof value === "number") {
            return value;
        }
        else {
            return undefined;
        }
    }
    else if (type === "array") {
        if (Array.isArray(value)) {
            return value;
        }
        else {
            return undefined;
        }
    }
    else if (type === "object") {
        if (typeof value === "object" && !Array.isArray(value) && value !== null) {
            return value;
        }
        else {
            return undefined;
        }
    }
    else {
        return value;
    }
};
const generateTranslationWithType = (slug, translationsNamespace, namespace, type) => {
    if (!translationsNamespace) {
        console.log(`next-translations - fail load namespace: ${namespace}`);
        return undefined;
    }
    const replaceSlugPathFromNamespace = slug.replace(":", ".");
    const pathTranslated = resolvePath(translationsNamespace, replaceSlugPathFromNamespace, undefined);
    if (pathTranslated === undefined) {
        console.log(`next-translations - Fail translation ${namespace}: ${slug}`);
        return undefined;
    }
    if (type) {
        const validPathTranslted = checkTypesAndReturn(type, pathTranslated);
        if (validPathTranslted !== undefined) {
            return validPathTranslted;
        }
        else {
            console.log(`next-translations - Fail type in translation ${namespace}: ${slug}`);
            return undefined;
        }
    }
    else {
        return pathTranslated;
    }
};
const useTranslation = (namespace) => {
    if (!pageTranslations) {
        return {
            t: (slug) => {
                console.log(`next-translations - No detected translations for this page ${namespace}: ${slug}`);
                return undefined;
            },
            tString: (slug) => {
                console.log(`next-translations - No detected translations for this page ${namespace}: ${slug}`);
                return undefined;
            },
            tNumber: (slug) => {
                console.log(`next-translations - No detected translations for this page ${namespace}: ${slug}`);
                return undefined;
            },
            tArray: (slug) => {
                console.log(`next-translations - No detected translations for this page ${namespace}: ${slug}`);
                return undefined;
            },
            tObject: (slug) => {
                console.log(`next-translations - No detected translations for this page ${namespace}: ${slug}`);
                return undefined;
            },
            tComponent: (slug, callback) => {
                console.log(`next-translations - No detected translations for this page ${namespace}: ${slug}`);
                return callback({
                    textBefore: undefined,
                    textComponent: undefined,
                    textAfter: undefined,
                });
            },
        };
    }
    const replacePathFromNamespace = namespace.replace(":", ".");
    const translationsNamespace = resolvePath(pageTranslations, replacePathFromNamespace, undefined);
    const t = (slug = "") => {
        return generateTranslationWithType(slug, translationsNamespace, namespace, "any");
    };
    const tString = (slug = "") => {
        return generateTranslationWithType(slug, translationsNamespace, namespace, "string");
    };
    const tNumber = (slug = "") => {
        return generateTranslationWithType(slug, translationsNamespace, namespace, "number");
    };
    const tArray = (slug = "") => {
        return generateTranslationWithType(slug, translationsNamespace, namespace, "array");
    };
    const tObject = (slug = "") => {
        return generateTranslationWithType(slug, translationsNamespace, namespace, "object");
    };
    const tComponent = (slug = "", callback) => {
        const generatedText = generateTranslationWithType(slug, translationsNamespace, namespace, "string");
        if (!generatedText) {
            return undefined;
        }
        let componentStartIndex = -1;
        let componentEndIndex = -1;
        let componentOnlyIndex = -1;
        let text = "";
        let textBefore = "";
        let textAfter = "";
        let textComponent = undefined;
        const generatedTextArray = generatedText.split(" ");
        generatedTextArray.forEach((itemText, indexText) => {
            const isStartComponent = itemText === "<" + translationsConfig.componentNameToReplaced + ">";
            if (isStartComponent) {
                componentStartIndex = indexText;
                return;
            }
            const isEndComponent = itemText === "</" + translationsConfig.componentNameToReplaced + ">";
            if (isEndComponent) {
                componentEndIndex = indexText;
                return;
            }
            const isOnlyComponent = itemText === "<" + translationsConfig.componentNameToReplaced + "/>";
            if (isOnlyComponent) {
                componentOnlyIndex = indexText;
                return;
            }
        });
        generatedTextArray.forEach((itemText, indexText) => {
            if (componentOnlyIndex === -1 &&
                componentStartIndex >= 0 &&
                componentEndIndex >= 0) {
                if (indexText < componentStartIndex) {
                    textBefore = `${textBefore ? textBefore + " " : ""}${itemText}`;
                }
                else if (indexText > componentStartIndex &&
                    indexText < componentEndIndex) {
                    textComponent = `${textComponent ? textComponent + " " : ""}${itemText}`;
                }
                else if (indexText > componentEndIndex) {
                    textAfter = `${textAfter ? textAfter + " " : ""}${itemText}`;
                }
            }
            else if (componentOnlyIndex >= 0) {
                if (indexText < componentOnlyIndex) {
                    textBefore = `${textBefore ? textBefore + " " : ""}${itemText}`;
                }
                else if (indexText > componentOnlyIndex) {
                    textAfter = `${textAfter ? textAfter + " " : ""}${itemText}`;
                }
            }
            else {
                text = `${text ? text + " " : ""}${itemText}`;
            }
        });
        return callback({
            textBefore,
            textComponent,
            textAfter,
        });
    };
    return {
        t,
        tString,
        tNumber,
        tArray,
        tObject,
        tComponent,
        pageTranslations,
    };
};
export { initializeTranslations, InitializeRedirectsTranslations, pageTranslations, useTranslation, };
