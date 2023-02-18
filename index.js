System.register("index", ["../../translations.config.ts", "fs-extra", "path"], function (exports_1, context_1) {
    "use strict";
    var translations_config_ts_1, fs_extra_1, path_1, translationsConfig, allTranslationsLanguages, getTranslationsFromFiles, getPaths, getStaticPaths;
    var __moduleName = context_1 && context_1.id;
    async function getTranslationsProps(ctx, ns = []) {
        let locale = translationsConfig.defaultLocale;
        if (ctx?.params?.locale) {
            locale = ctx.params.locale;
        }
        const defaultNamespacesToUseInAllPages = translationsConfig.constNamespaces;
        const props = {
            ...(await getTranslationsFromFiles(locale, [
                ...ns,
                ...defaultNamespacesToUseInAllPages,
            ])),
        };
        return props;
    }
    exports_1("getTranslationsProps", getTranslationsProps);
    return {
        setters: [
            function (translations_config_ts_1_1) {
                translations_config_ts_1 = translations_config_ts_1_1;
            },
            function (fs_extra_1_1) {
                fs_extra_1 = fs_extra_1_1;
            },
            function (path_1_1) {
                path_1 = path_1_1;
            }
        ],
        execute: function () {
            translationsConfig = {
                defaultLocale: translations_config_ts_1.default?.defaultLocale || "en",
                locales: translations_config_ts_1.default?.locales || ["en"],
                outputFolderTranslations: translations_config_ts_1.default?.outputFolderTranslations || "/public/locales",
                languageWithoutMultirouting: translations_config_ts_1.default?.languageWithoutMultirouting || undefined,
                constNamespaces: translations_config_ts_1.default?.constNamespaces || ["common"],
            };
            allTranslationsLanguages = translationsConfig.locales;
            exports_1("allTranslationsLanguages", allTranslationsLanguages);
            getTranslationsFromFiles = async (locale = translationsConfig.defaultLocale, ns = []) => {
                let translations = {};
                try {
                    for (const namespace of ns) {
                        const folderPath = `../..${translationsConfig.outputFolderTranslations}/${locale}/${namespace}.json`;
                        const exists = await fs_extra_1.default.pathExists(path_1.default.resolve(__dirname, folderPath));
                        if (exists) {
                            const translationsJson = await fs_extra_1.default.readJson(path_1.default.resolve(__dirname, folderPath));
                            if (translationsJson) {
                                translations = { ...translations, [namespace]: translationsJson };
                            }
                        }
                        else {
                            console.error("Path not found!!!");
                        }
                    }
                    return { translations: translations };
                }
                catch (err) {
                    console.error(err);
                }
            };
            getPaths = () => {
                return allTranslationsLanguages
                    .filter((item) => item !== translationsConfig.languageWithoutMultirouting)
                    .map((lng) => ({
                    params: {
                        locale: lng,
                    },
                }));
            };
            exports_1("getPaths", getPaths);
            getStaticPaths = () => {
                return {
                    fallback: false,
                    paths: getPaths(),
                };
            };
            exports_1("getStaticPaths", getStaticPaths);
        }
    };
});
