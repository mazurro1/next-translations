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
const translationsConfig = {
    defaultLocale: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.defaultLocale) || "en",
    locales: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.locales) || ["en"],
    outputFolderTranslations: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.outputFolderTranslations) || "/public/locales",
    defaultLocaleWithMultirouting: translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.defaultLocaleWithMultirouting,
    constNamespaces: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.constNamespaces) || ["common"],
};
const getTranslationsFromFiles = (locale = translationsConfig.defaultLocale, ns = [], fullURL) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const translations = {};
    const uniqueArray = (_a = ns === null || ns === void 0 ? void 0 : ns.filter((value, index, self) => {
        return self.indexOf(value) === index && !!value;
    })) !== null && _a !== void 0 ? _a : [];
    try {
        for (const namespace of uniqueArray) {
            const extractedPath = translationsConfig.outputFolderTranslations.substring(translationsConfig.outputFolderTranslations.lastIndexOf("/"));
            const folderPath = `${fullURL}${extractedPath}/${locale}/${namespace}.json`;
            const fetchedFile = yield fetch(folderPath, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });
            if (fetchedFile.ok) {
                const translationsJson = yield fetchedFile.json();
                if (translationsJson) {
                    translations[namespace] = translationsJson;
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
export function getTranslationsPropsServer(ctx, ns = []) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        let locale = translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.defaultLocale;
        if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _a === void 0 ? void 0 : _a.locale) {
            const isInLocales = (_b = translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.locales) === null || _b === void 0 ? void 0 : _b.some((itemLocale) => { var _a; return itemLocale === ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _a === void 0 ? void 0 : _a.locale); });
            locale = isInLocales
                ? (_c = ctx === null || ctx === void 0 ? void 0 : ctx.params) === null || _c === void 0 ? void 0 : _c.locale
                : translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.defaultLocale;
        }
        const defaultNamespacesToUseInAllPages = translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.constNamespaces;
        ctx.locale = locale;
        ctx.locales = translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.locales;
        ctx.defaultLocale = translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.defaultLocale;
        const referer = (_e = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.req) === null || _d === void 0 ? void 0 : _d.headers) === null || _e === void 0 ? void 0 : _e.referer;
        const protocol = referer ? (_f = new URL(referer)) === null || _f === void 0 ? void 0 : _f.protocol : "http:";
        const host = (_h = (_g = ctx === null || ctx === void 0 ? void 0 : ctx.req) === null || _g === void 0 ? void 0 : _g.headers) === null || _h === void 0 ? void 0 : _h.host;
        const fullURL = `${protocol}//${host}`;
        const props = Object.assign({}, (yield getTranslationsFromFiles(locale, [...ns, ...defaultNamespacesToUseInAllPages], fullURL)));
        return props;
    });
}
