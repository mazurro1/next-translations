import fse from "fs-extra";
import fetch from "node-fetch";
//@ts-ignore
import translationsConfigUser from "../../translations.config.js";
import * as dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";
dotenv.config();

const translationsConfig = {
  locales: translationsConfigUser?.locales || ["en"],
  linkFetchTranslations: translationsConfigUser?.linkFetchTranslations,
  outputFolderTranslations:
    translationsConfigUser?.outputFolderTranslations || "/public/locales",
  namespaces: translationsConfigUser?.namespaces || ["common"],
};

const fetchLanguages = async (language: string, namespace: string) => {
  const linkToFetch = translationsConfig.linkFetchTranslations(
    process.env?.FLEX_PUBLIC_APP_ENV,
    language,
    namespace
  );
  const result = await fetch(linkToFetch);
  return result.json();
};

export const downloadLanguages = async () => {
  if (!translationsConfig?.linkFetchTranslations) {
    console.log("No detected link to download translations :(");
    return;
  }

  console.log("Fetching translations from api...");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  try {
    for (const lang of translationsConfig.locales) {
      const validLanguage = lang === "ua" ? "uk" : lang;

      for (const namespace of translationsConfig.namespaces) {
        const data = await fetchLanguages(validLanguage, namespace);
        if (data) {
          const folderPath = `../..${translationsConfig.outputFolderTranslations}/${lang}/${namespace}.json`;
          const pathToFile = path.resolve(__dirname, folderPath);

          await fse.outputFile(pathToFile, JSON.stringify(data));
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
