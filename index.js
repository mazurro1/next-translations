define("index", ["require", "exports", "../../translations.config.js", "fs-extra", "path"], function (require, exports, translations_config_js_1, fse, path) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getStaticPaths = exports.getPaths = exports.getTranslationsProps = exports.allTranslationsLanguages = void 0;
    // const translationsConfigUser = require("../../translations.config.js");
    // const fse = require("fs-extra");
    // const path = require("path");
    const translationsConfig = {
        defaultLocale: translations_config_js_1.default?.defaultLocale || "en",
        locales: translations_config_js_1.default?.locales || ["en"],
        outputFolderTranslations: translations_config_js_1.default?.outputFolderTranslations || "/public/locales",
        languageWithoutMultirouting: translations_config_js_1.default?.languageWithoutMultirouting || undefined,
        constNamespaces: translations_config_js_1.default?.constNamespaces || ["common"],
    };
    const allTranslationsLanguages = translationsConfig.locales;
    exports.allTranslationsLanguages = allTranslationsLanguages;
    const getTranslationsFromFiles = async (locale = translationsConfig.defaultLocale, ns = []) => {
        let translations = {};
        try {
            for (const namespace of ns) {
                const folderPath = `../..${translationsConfig.outputFolderTranslations}/${locale}/${namespace}.json`;
                const exists = await fse.pathExists(path.resolve(__dirname, folderPath));
                if (exists) {
                    const translationsJson = await fse.readJson(path.resolve(__dirname, folderPath));
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
    exports.getTranslationsProps = getTranslationsProps;
    const getPaths = () => {
        return allTranslationsLanguages
            .filter((item) => item !== translationsConfig.languageWithoutMultirouting)
            .map((lng) => ({
            params: {
                locale: lng,
            },
        }));
    };
    exports.getPaths = getPaths;
    const getStaticPaths = () => {
        return {
            fallback: false,
            paths: getPaths(),
        };
    };
    exports.getStaticPaths = getStaticPaths;
});
// module.exports = {
//   allTranslationsLanguages,
//   getTranslationsProps,
//   getPaths,
//   getStaticPaths,
// };
