import fse from "fs-extra";
import path from "path";
const exists = await fse.pathExists(path.resolve(__dirname, `../../translations.config.ts`));
let translationsConfigUser = undefined;
if (exists) {
    translationsConfigUser = path.resolve(__dirname, `../../translations.config.ts`);
}
else {
    console.log(`next-translations - fail on load translations.config.ts`);
}
const translationsConfig = {
    defaultLocale: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.defaultLocale) || "en",
    locales: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.locales) || ["en"],
    outputFolderTranslations: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.outputFolderTranslations) || "/public/locales",
    languageWithoutMultirouting: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.languageWithoutMultirouting) || undefined,
    constNamespaces: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.constNamespaces) || ["common"],
};
const allTranslationsLanguages = translationsConfig.locales;
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
    var _a;
    let locale = translationsConfig.defaultLocale;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _a === void 0 ? void 0 : _a.locale) {
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
const getPaths = () => {
    return allTranslationsLanguages
        .filter((item) => item !== translationsConfig.languageWithoutMultirouting)
        .map((lng) => ({
        params: {
            locale: lng,
        },
    }));
};
const getStaticPaths = () => {
    return {
        fallback: false,
        paths: getPaths(),
    };
};
// module.exports = {
//   allTranslationsLanguages,
//   getTranslationsProps,
//   getPaths,
//   getStaticPaths,
// };
export { allTranslationsLanguages, getTranslationsProps, getPaths, getStaticPaths, };
//# sourceMappingURL=index.js.map