//@ts-ignore
import translationsConfigUser from "../../translations.config.js";
import fse from "fs-extra";
import path from "path";
import {fileURLToPath} from "url";

type ITranslationConfigType = {
  defaultLocale: string;
  locales: string[];
  outputFolderTranslations: string;
  languageWithoutMultirouting?: string;
  constNamespaces: string[];
};

const translationsConfig: ITranslationConfigType = {
  defaultLocale: translationsConfigUser?.defaultLocale || "en",
  locales: translationsConfigUser?.locales || ["en"],
  outputFolderTranslations:
    translationsConfigUser?.outputFolderTranslations || "/public/locales",
  languageWithoutMultirouting:
    translationsConfigUser?.languageWithoutMultirouting || undefined,
  constNamespaces: translationsConfigUser?.constNamespaces || ["common"],
};

const allTranslationsLanguages = translationsConfig.locales;

const getTranslationsFromFiles = async (
  locale: string = translationsConfig.defaultLocale,
  ns: string[] = []
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let translations = {};
  try {
    for (const namespace of ns) {
      const folderPath = `../..${translationsConfig.outputFolderTranslations}/${locale}/${namespace}.json`;
      const pathToFile = path.resolve(__dirname, folderPath);
      const exists = await fse.pathExists(pathToFile);

      if (exists) {
        const translationsJson = await fse.readJson(pathToFile);
        if (translationsJson) {
          translations = {...translations, [namespace]: translationsJson};
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
  return (allTranslationsLanguages as string[])
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

export {
  allTranslationsLanguages,
  getTranslationsProps,
  getPaths,
  getStaticPaths,
};
