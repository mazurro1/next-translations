type IPageTranslationsType = {
  [key: string]: any;
};

let pageTranslations: IPageTranslationsType | null = null;

const initializeTranslations = (translations: IPageTranslationsType) => {
  pageTranslations = translations;
};

const useTranslation = (namespace: string) => {
  if (!pageTranslations) {
    return {
      t: (slug: string) => {
        return `${namespace}: ${slug}`;
      },
    };
  }

  const translationsNamespace: IPageTranslationsType | undefined =
    pageTranslations[namespace];

  const t = (slug = ""): any => {
    if (!translationsNamespace) {
      console.log(`Fail translation ${namespace}: ${slug}`);
      return `${namespace}: ${slug}`;
    }

    const splitPath = slug.split(".");
    let pathTranslationd: IPageTranslationsType | null = null;
    for (const path of splitPath) {
      const tryTranslation: IPageTranslationsType = pathTranslationd
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
    pageTranslations,
  };
};

export {initializeTranslations, pageTranslations, useTranslation};
// module.exports = {initializeTranslations, pageTranslations, useTranslation};
