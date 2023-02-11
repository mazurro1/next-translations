import fse from "fs-extra";
import path from "path";
//@ts-ignore
import translatesConfigUser from "../../translates.config.js";
// const fse = require("fs-extra");
// const path = require("path");
// const translatesConfigUser = require("../../translates.config.js");

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

const allTranslatesLanguages = translatesConfig.locales;

const getTranslatesFromFiles = async (
  locale: string = translatesConfig.defaultLocale,
  ns: string[] = []
) => {
  let translates = {};
  try {
    for (const namespace of ns) {
      const folderPath = `../..${translatesConfig.outputFolderTranslates}/${locale}/${namespace}.json`;

      const exists = await fse.pathExists(path.resolve(__dirname, folderPath));

      if (exists) {
        const translatesJson = await fse.readJson(
          path.resolve(__dirname, folderPath)
        );
        if (translatesJson) {
          translates = {...translates, [namespace]: translatesJson};
        }
      } else {
        console.error("Path not found!!!");
      }
    }
    return {translates: translates};
  } catch (err) {
    console.error(err);
  }
};

async function getTranslatesProps(ctx: any, ns: string[] = []) {
  let locale: string = translatesConfig.defaultLocale;
  if (ctx?.params?.locale) {
    locale = ctx.params.locale;
  }
  const defaultNamespacesToUseInAllPages = translatesConfig.constNamespaces;

  const props = {
    ...(await getTranslatesFromFiles(locale, [
      ...ns,
      ...defaultNamespacesToUseInAllPages,
    ])),
  };
  return props;
}

const getPaths = () => {
  return (allTranslatesLanguages as string[])
    .filter((item) => item !== translatesConfig.languageWithoutMultirouting)
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

// module.exports = {
//   allTranslatesLanguages,
//   getTranslatesProps,
//   getPaths,
//   getStaticPaths,
// };
export {allTranslatesLanguages, getTranslatesProps, getPaths, getStaticPaths};
