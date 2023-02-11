type ITranslationsPageType = {
  [key: string]: any;
};

let translationsPage: ITranslationsPageType | null = null;

const initializeTranslations = (translations: ITranslationsPageType) => {
  translationsPage = translations;
};

const useTranslation = (namespace: string) => {
  if (!translationsPage) {
    return {
      t: (slug) => {
        return `${namespace}: ${slug}`;
      },
    };
  }

  const translationsNamespace: ITranslationsPageType | undefined =
    translationsPage[namespace];

  const t = (slug = "") => {
    if (!translationsNamespace) {
      console.log(`Fail translate ${namespace}: ${slug}`);
      return `${namespace}: ${slug}`;
    }

    const splitPath = slug.split(".");
    let pathTranslated: ITranslationsPageType | null = null;
    for (const path of splitPath) {
      const tryTranslate: ITranslationsPageType = pathTranslated
        ? pathTranslated[path]
        : translationsNamespace[path];

      if (tryTranslate !== undefined) {
        pathTranslated = tryTranslate;
      } else {
        console.log(`Fail translate ${namespace}: ${slug}`);
        return `${namespace}: ${slug}`;
      }
    }

    return pathTranslated;
  };

  return {
    t,
    translationsPage,
  };
};

export {initializeTranslations, translationsPage, useTranslation};
// module.exports = {initializeTranslations, translationsPage, useTranslation};
