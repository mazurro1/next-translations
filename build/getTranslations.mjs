import fse from "fs-extra";
import fetch from "node-fetch";
import translationsConfigUser from "../../translations.config.js";
import * as dotenv from "dotenv";
dotenv.config();
const translationsConfig = {
    locales: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.locales) || ["en"],
    linkFetchTranslations: translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.linkFetchTranslations,
    outputFolderTranslations: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.outputFolderTranslations) || "/public/locales",
    namespaces: (translationsConfigUser === null || translationsConfigUser === void 0 ? void 0 : translationsConfigUser.namespaces) || ["common"],
};
const fetchLanguages = async (language, namespace) => {
    var _a;
    if (!(translationsConfig === null || translationsConfig === void 0 ? void 0 : translationsConfig.linkFetchTranslations)) {
        console.log("No detected link to download translations :(");
        return;
    }
    const linkToFetch = translationsConfig.linkFetchTranslations((_a = process.env) === null || _a === void 0 ? void 0 : _a.FLEX_PUBLIC_APP_ENV, language, namespace);
    const result = await fetch(linkToFetch);
    return result.json();
};
export const downloadLanguages = async () => {
    console.log("Fetching translations from api...");
    try {
        for (const lang of translationsConfig.locales) {
            const validLanguage = lang === "ua" ? "uk" : lang;
            for (const namespace of translationsConfig.namespaces) {
                const data = await fetchLanguages(validLanguage, namespace);
                if (data) {
                    await fse.outputFile(`.${translationsConfig.outputFolderTranslations}/${lang}/${namespace}.json`, JSON.stringify(data));
                }
            }
        }
        console.log("Fetching translations success!!!");
        return 0;
    }
    catch (err) {
        console.error(err);
        return 0;
    }
};
downloadLanguages();
//# sourceMappingURL=getTranslations.mjs.map