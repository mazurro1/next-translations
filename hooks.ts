type ITranslatesPageType = {
  [key: string]: any;
};

let translatesPage: ITranslatesPageType | null = null;

const initializeTranslates = (translates: ITranslatesPageType) => {
  translatesPage = translates;
};

const useTranslation = (namespace: string) => {
  if (!translatesPage) {
    return {
      t: (slug) => {
        return `${namespace}: ${slug}`;
      },
    };
  }

  const translatesNamespace: ITranslatesPageType | undefined =
    translatesPage[namespace];

  const t = (slug = "") => {
    if (!translatesNamespace) {
      console.log(`Fail translate ${namespace}: ${slug}`);
      return `${namespace}: ${slug}`;
    }

    const splitPath = slug.split(".");
    let pathTranslated: ITranslatesPageType | null = null;
    for (const path of splitPath) {
      const tryTranslate: ITranslatesPageType = pathTranslated
        ? pathTranslated[path]
        : translatesNamespace[path];

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
    translatesPage,
  };
};

export {initializeTranslates, translatesPage, useTranslation};
// module.exports = {initializeTranslates, translatesPage, useTranslation};
