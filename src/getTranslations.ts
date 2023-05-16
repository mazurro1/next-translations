/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as dotenv from "dotenv";
import fse from "fs-extra";
import fetch from "node-fetch";

import path from "path";
import {fileURLToPath} from "url";

// @ts-ignore
import translationsConfigUser from "../../translations.config.js";
dotenv.config();

const translationsConfig = {
  locales: translationsConfigUser?.locales || ["en"],
  linkFetchTranslations: translationsConfigUser?.linkFetchTranslations,
  outputFolderTranslations:
    translationsConfigUser?.outputFolderTranslations || "/public/locales",
  namespacesToFetch: translationsConfigUser?.namespacesToFetch || ["common"],
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
      for (const namespace of translationsConfig.namespacesToFetch) {
        const data = await fetchLanguages(lang, namespace);
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
