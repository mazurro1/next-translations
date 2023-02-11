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
      console.log(`Fail translation ${namespace}: ${slug}`);
      return `${namespace}: ${slug}`;
    }

    const splitPath = slug.split(".");
    let pathTranslationd: ITranslationsPageType | null = null;
    for (const path of splitPath) {
      const tryTranslation: ITranslationsPageType = pathTranslationd
        ? pathTranslationd[path]
        : translationsNamespace[path];

      if (tryTranslation !== undefined) {
        pathTranslationd = tryTranslation;
      } else {
        console.log(`Fail translation ${namespace}: ${slug}`);
        return `${namespace}: ${slug}`;
      }
    }

    return pathTranslationd;
  };

  return {
    t,
    translationsPage,
  };
};

export {initializeTranslations, translationsPage, useTranslation};
// module.exports = {initializeTranslations, translationsPage, useTranslation};
