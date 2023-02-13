import fse from "fs-extra";
import fetch from "node-fetch";
import translationsConfigUser from "../../translations.config.js";

const translationsConfig = {
  locales: translationsConfigUser?.locales || ["en"],
  linkFetchTranslations: translationsConfigUser?.linkFetchTranslations,
  outputFolderTranslations:
    translationsConfigUser?.outputFolderTranslations || "/public/locales",
  namespaces: translationsConfigUser?.namespaces || ["common"],
};

const fetchLanguages = async (language, namespace) => {
  if (!translationsConfig?.linkFetchTranslations) {
    console.log("No detected link to download translations :(");
    return;
  }
  const linkToFetch = translationsConfig.linkFetchTranslations(
    language,
    namespace
  );
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
          await fse.outputFile(
            `.${translationsConfig.outputFolderTranslations}/${lang}/${namespace}.json`,
            JSON.stringify(data)
          );
        }
      }
    }
    console.log("Fetching translations success!!!");
    return 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

downloadLanguages();
