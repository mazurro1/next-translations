//@ts-ignore
import translationsConfigUser from "../../translations.config.js";

type T_TranslationConfig = {
  defaultLocale: string;
  locales: string[];
  outputFolderTranslations: string;
  defaultLocaleWithMultirouting?: boolean;
  constNamespaces: string[];
};

export type T_PageTranslations = {
  [key: string]: any;
};

const translationsConfig: T_TranslationConfig = {
  defaultLocale: translationsConfigUser?.defaultLocale || "en",
  locales: translationsConfigUser?.locales || ["en"],
  outputFolderTranslations:
    translationsConfigUser?.outputFolderTranslations || "/public/locales",
  defaultLocaleWithMultirouting:
    translationsConfigUser?.defaultLocaleWithMultirouting,
  constNamespaces: translationsConfigUser?.constNamespaces || ["common"],
};

const getTranslationsFromFiles = async (
  locale: string = translationsConfig.defaultLocale,
  ns: string[] = [],
  fullURL: string
) => {
  const translations: T_PageTranslations = {};

  const uniqueArray =
    ns?.filter((value, index, self) => {
      return self.indexOf(value) === index && !!value;
    }) ?? [];

  try {
    for (const namespace of uniqueArray) {
      const extractedPath =
        translationsConfig.outputFolderTranslations.substring(
          translationsConfig.outputFolderTranslations.lastIndexOf("/")
        );
      const folderPath = `${fullURL}${extractedPath}/${locale}/${namespace}.json`;

      const fetchedFile = await fetch(folderPath, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (fetchedFile.ok) {
        const translationsJson = await fetchedFile.json();
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

export async function getTranslationsPropsServer(ctx: any, ns: string[] = []) {
  let locale: string = translationsConfig?.defaultLocale;

  if (ctx?.params?.locale) {
    const isInLocales = translationsConfig?.locales?.some(
      (itemLocale) => itemLocale === ctx?.params?.locale
    );

    locale = isInLocales
      ? ctx?.params?.locale
      : translationsConfig?.defaultLocale;
  }
  const defaultNamespacesToUseInAllPages = translationsConfig?.constNamespaces;

  ctx.locale = locale;
  ctx.locales = translationsConfig?.locales;
  ctx.defaultLocale = translationsConfig?.defaultLocale;

  const referer = ctx?.req?.headers?.referer;
  const protocol = referer ? new URL(referer)?.protocol : "http:";
  const host = ctx?.req?.headers?.host;
  const fullURL = `${protocol}//${host}`;

  const props = {
    ...(await getTranslationsFromFiles(
      locale,
      [...ns, ...defaultNamespacesToUseInAllPages],
      fullURL
    )),
  };

  return props;
}
