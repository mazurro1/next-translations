import fse from "fs-extra";
import fetch from "node-fetch";
import translatesConfigUser from "../../translates.config.js";

const translatesConfig = {
  defaultLocale: translatesConfigUser?.defaultLocale || "pl",
  locales: translatesConfigUser?.locales || ["en"],
  linkFetchTranslates: translatesConfigUser?.linkFetchTranslates,
  outputFolderTranslates:
    translatesConfigUser?.outputFolderTranslates || "/public/locales",
  nameFolderMultirouting:
    translatesConfigUser?.nameFolderMultirouting || "locale",
  languageWithoutMultirouting:
    translatesConfigUser?.languageWithoutMultirouting || undefined,
  constNamespaces: translatesConfigUser?.constNamespaces || ["common"],
  namespaces: translatesConfigUser?.namespaces || ["common"],
};

const fetchLanguages = async (language, namespace) => {
  if (!translatesConfig?.linkFetchTranslates) {
    console.log("No detected link to download translates :(");
    return;
  }
  const linkToFetch = translatesConfig.linkFetchTranslates(language, namespace);
  const result = await fetch(linkToFetch);
  return result.json();
};

export const downloadLanguages = async () => {
  console.log("Fetching translates from api...");

  try {
    for (const lang of translatesConfig.locales) {
      const validLanguage = lang === "ua" ? "uk" : lang;

      for (const namespace of translatesConfig.namespaces) {
        const data = await fetchLanguages(validLanguage, namespace);
        if (data) {
          await fse.outputFile(
            `.${translatesConfig.outputFolderTranslates}/${lang}/${namespace}.json`,
            JSON.stringify(data)
          );
        }
      }
    }
    console.log("Fetching translates success!!!");
    return 0;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

downloadLanguages();
