type IPageTranslationsType = {
  [key: string]: any;
};

type IType = "string" | "number" | "array" | "object";

type ITPropsType =
  | {
      slug: string;
      type?: IType;
    }
  | string;

let pageTranslations: IPageTranslationsType | null = null;

const initializeTranslations = (translations: IPageTranslationsType) => {
  pageTranslations = translations;
};

const checkTypesAndReturn = (
  type: IType,
  value: any
): string | number | Object | any[] | undefined => {
  if (type === "string") {
    if (typeof value === "string") {
      return value;
    } else {
      return undefined;
    }
  } else if (type === "number") {
    if (typeof value === "number") {
      return value;
    } else {
      return undefined;
    }
  } else if (type === "array") {
    if (Array.isArray(value)) {
      return value;
    } else {
      return undefined;
    }
  } else if (type === "object") {
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      return value as Object;
    } else {
      return undefined;
    }
  }
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

  const t = (props: ITPropsType = "") => {
    let slug = "";
    let type: undefined | IType = undefined;

    if (typeof props === "string") {
      slug = props;
    } else {
      slug = props.slug;
      if (props.type) {
        if (typeof props.type === "string") {
          type = props.type;
        }
      }
    }

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

    if ((pathTranslationd as any) === `${namespace}: ${slug}`) {
      return pathTranslationd;
    }

    if (type) {
      const validValue = checkTypesAndReturn(type, pathTranslationd);
      if (validValue !== undefined) {
        return validValue;
      } else {
        console.log(`Fail type ${namespace}: ${slug}`);
        return `${namespace}: ${slug}`;
      }
    } else {
      return pathTranslationd;
    }
  };

  return {
    t,
    pageTranslations,
  };
};

// export {initializeTranslations, pageTranslations, useTranslation};
module.exports = {initializeTranslations, pageTranslations, useTranslation};
