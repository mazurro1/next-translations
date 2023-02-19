var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore
import translationsConfigUser from "../../translations.config.js";
import fse from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const translationsConfig = {
    defaultLocale: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.defaultLocale) || "en",
    locales: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.locales) || ["en"],
    outputFolderTranslations: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.outputFolderTranslations) || "/public/locales",
    languageWithoutMultirouting: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.languageWithoutMultirouting) || undefined,
    constNamespaces: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.constNamespaces) || ["common"],
};
const allTranslationsLanguages = translationsConfig.locales;
const getTranslationsFromFiles = (locale = translationsConfig.defaultLocale, ns = []) => __awaiter(void 0, void 0, void 0, function* () {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let translations = {};
    try {
        for (const namespace of ns) {
            const folderPath = `../..${translationsConfig.outputFolderTranslations}/${locale}/${namespace}.json`;
            const pathToFile = path.resolve(__dirname, folderPath);
            const exists = yield fse.pathExists(pathToFile);
            if (exists) {
                const translationsJson = yield fse.readJson(pathToFile);
                if (translationsJson) {
                    translations = Object.assign(Object.assign({}, translations), { [namespace]: translationsJson });
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
});
function getTranslationsProps(ctx, ns = []) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let locale = translationsConfig.defaultLocale;
        if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _a === void 0 ? void 0 : _a.locale) {
            const isInLocales = translationsConfig.locales.some((itemLocale) => itemLocale === ctx.params.locale);
            locale = isInLocales ? ctx.params.locale : translationsConfig.defaultLocale;
        }
        const defaultNamespacesToUseInAllPages = translationsConfig.constNamespaces;
        ctx.locale = locale;
        ctx.locales = translationsConfig.locales;
        ctx.defaultLocale = translationsConfig.defaultLocale;
        const props = Object.assign({}, (yield getTranslationsFromFiles(locale, [
            ...ns,
            ...defaultNamespacesToUseInAllPages,
        ])));
        return props;
    });
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
export { allTranslationsLanguages, getTranslationsProps, getPaths, getStaticPaths, };
