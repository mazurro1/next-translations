type IpageTranslationsType = {
  [key: string]: any;
};

let pageTranslations: IpageTranslationsType | null = null;

const initializeTranslations = (translations: IpageTranslationsType) => {
  pageTranslations = translations;
};

const useTranslation = (namespace: string) => {
  if (!pageTranslations) {
    return {
      t: (slug) => {
        return `${namespace}: ${slug}`;
      },
    };
  }

  const translationsNamespace: IpageTranslationsType | undefined =
    pageTranslations[namespace];

  const t = (slug = "") => {
    if (!translationsNamespace) {
      console.log(`Fail translation ${namespace}: ${slug}`);
      return `${namespace}: ${slug}`;
    }

    const splitPath = slug.split(".");
    let pathTranslationd: IpageTranslationsType | null = null;
    for (const path of splitPath) {
      const tryTranslation: IpageTranslationsType = pathTranslationd
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
