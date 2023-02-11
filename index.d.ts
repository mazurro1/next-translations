declare const fse: any;
declare const path: any;
declare const translationsConfigUser: any;
declare const translationsConfig: {
  defaultLocale: any;
  locales: any;
  linkFetchTranslations: any;
  outputFolderTranslations: any;
  nameFolderMultirouting: any;
  languageWithoutMultirouting: any;
  constNamespaces: any;
  namespaces: any;
};
declare const allTranslationsLanguages: any;
declare const getTranslationsFromFiles: (
  locale?: string,
  ns?: string[]
) => Promise<{
  translations: {};
}>;
declare function getTranslationsProps(
  ctx: any,
  ns?: string[]
): Promise<{
  translations: {};
}>;
declare const getPaths: () => {
  params: {
    locale: string;
  };
}[];
declare const getStaticPaths: () => {
  fallback: boolean;
  paths: {
    params: {
      locale: string;
    };
  }[];
};
