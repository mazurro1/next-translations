/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fse from "fs-extra";

import path from "path";
import {fileURLToPath} from "url";

//@ts-ignore
import translationsConfigUser from "../../translations.config.js";

import type {TPageTranslations} from "./hooks";

type TTranslationConfig = {
  defaultLocale: string;
  locales: string[];
  outputFolderTranslations: string;
  defaultLocaleWithMultirouting?: boolean;
  constNamespaces: string[];
};

const translationsConfig: TTranslationConfig = {
  defaultLocale: translationsConfigUser?.defaultLocale || "en",
  locales: translationsConfigUser?.locales || ["en"],
  outputFolderTranslations:
    translationsConfigUser?.outputFolderTranslations || "/public/locales",
  defaultLocaleWithMultirouting:
    translationsConfigUser?.defaultLocaleWithMultirouting,
  constNamespaces: translationsConfigUser?.constNamespaces || ["common"],
};

const allTranslationsLanguages = translationsConfig.locales;

const getTranslationsFromFiles = async (
  locale: string = translationsConfig.defaultLocale,
  ns: string[] = []
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const translations: TPageTranslations = {};

  const uniqueArray = ns.filter((value, index, self) => {
    return self.indexOf(value) === index && !!value;
  });

  try {
    for (const namespace of uniqueArray) {
      const folderPath = `../..${translationsConfig.outputFolderTranslations}/${locale}/${namespace}.json`;
      const pathToFile = path.resolve(__dirname, folderPath);
      const exists = await fse.pathExists(pathToFile);

      if (exists) {
        const translationsJson = await fse.readJson(pathToFile);
        if (translationsJson) {
          translations[namespace] = translationsJson;
        }
      } else {
        console.error("Path not found!!!");
      }
    }
    return {translations: translations};
  } catch (err) {
    console.error(err);
  }
};

async function getTranslationsProps(ctx: any, ns: string[] = []) {
  let locale: string = translationsConfig.defaultLocale;

  if (ctx?.params?.locale) {
    const isInLocales = translationsConfig.locales.some(
      (itemLocale) => itemLocale === ctx.params.locale
    );

    locale = isInLocales ? ctx.params.locale : translationsConfig.defaultLocale;
  }
  const defaultNamespacesToUseInAllPages = translationsConfig.constNamespaces;

  ctx.locale = locale;
  ctx.locales = translationsConfig.locales;
  ctx.defaultLocale = translationsConfig.defaultLocale;

  const props = {
    ...(await getTranslationsFromFiles(locale, [
      ...ns,
      ...defaultNamespacesToUseInAllPages,
    ])),
  };

  return props;
}

const getPaths = () => {
  return translationsConfig.locales
    .filter((item) => {
      if (!translationsConfig.defaultLocaleWithMultirouting) {
        return item !== translationsConfig.defaultLocale;
      } else {
        return true;
      }
    })
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

export {
  allTranslationsLanguages,
  getTranslationsProps,
  getPaths,
  getStaticPaths,
};
