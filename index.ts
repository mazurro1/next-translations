import fse from "fs-extra";
import path from "path";

const exists = await fse.pathExists(
  path.resolve(__dirname, `../../translations.config.ts`)
);

type TranslationsConfigType = {
  defaultLocale?: string;
  locales?: string[];
  outputFolderTranslations?: string;
  componentNameToReplaced?: string;
  languageWithoutMultirouting?: string;
  constNamespaces?: string[];
};

let translationsConfigUser: TranslationsConfigType | undefined = undefined;

if (exists) {
  translationsConfigUser = path.resolve(
    __dirname,
    `../../translations.config.ts`
  ) as TranslationsConfigType;
} else {
  console.log(`next-translations - fail on load translations.config.ts`);
}

const translationsConfig = {
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
  let translations = {};
  try {
    for (const namespace of ns) {
      const folderPath = `../..${translationsConfig.outputFolderTranslations}/${locale}/${namespace}.json`;

      const exists = await fse.pathExists(path.resolve(__dirname, folderPath));

      if (exists) {
        const translationsJson = await fse.readJson(
          path.resolve(__dirname, folderPath)
        );
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
