System.register("hooks", ["fs-extra", "path"], function (exports_1, context_1) {
    "use strict";
    var fs_extra_1, path_1, exists, translationsConfigUser, translationsConfig, pageTranslations, resolvePath, initializeTranslations, checkTypesAndReturn, generateTranslationWithType, useTranslation;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (fs_extra_1_1) {
                fs_extra_1 = fs_extra_1_1;
            },
            function (path_1_1) {
                path_1 = path_1_1;
            }
        ],
        execute: async function () {
            exists = await fs_extra_1.default.pathExists(path_1.default.resolve(__dirname, `../../translations.config.ts`));
            translationsConfigUser = undefined;
            if (exists) {
                translationsConfigUser = path_1.default.resolve(__dirname, `../../translations.config.ts`);
            }
            else {
                console.log(`next-translations - fail on load translations.config.ts`);
            }
            translationsConfig = {
                componentNameToReplaced: translationsConfigUser?.componentNameToReplaced || "TComponent",
            };
            pageTranslations = null;
            exports_1("pageTranslations", pageTranslations);
            resolvePath = (object, path, defaultValue = undefined) => path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);
            initializeTranslations = (translations) => {
                exports_1("pageTranslations", pageTranslations = translations);
            };
            exports_1("initializeTranslations", initializeTranslations);
            checkTypesAndReturn = (type, value) => {
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
            generateTranslationWithType = (slug, translationsNamespace, namespace, type) => {
                if (!translationsNamespace) {
                    console.log(`next-translations - fail load namespace: ${namespace}`);
                    return undefined;
                }
                const pathTranslated = resolvePath(translationsNamespace, slug, undefined);
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
            useTranslation = (namespace) => {
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
                const translationsNamespace = resolvePath(pageTranslations, namespace, undefined);
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
            exports_1("useTranslation", useTranslation);
        }
    };
});
