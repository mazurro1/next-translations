//@ts-ignore
import translationsConfigUser from "../../translations.config.js";
// const translationsConfigUser = require("../../translations.config.js");

const translationsConfig = {
  componentNameToReplaced:
    translationsConfigUser?.componentNameToReplaced || "TComponent",
};

type IPageTranslationsType = {
  [key: string]: any;
};

type IType = "string" | "number" | "array" | "object" | "any";

type ICallbackType = {
  textBefore: string | undefined;
  children: string | undefined;
  textAfter: string | undefined;
};

let pageTranslations: IPageTranslationsType | null = null;

const initializeTranslations = (translations: IPageTranslationsType) => {
  pageTranslations = translations;
};

const checkTypesAndReturn = (type: IType, value: any) => {
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
      return value;
    } else {
      return undefined;
    }
  } else {
    return value;
  }
};

const generateTranslationWithType = (
  slug: string,
  translationsNamespace: IPageTranslationsType | undefined,
  namespace: string,
  type: IType
) => {
  if (!translationsNamespace) {
    console.log(`next-translations - fail load namespace: ${namespace}`);
    return undefined;
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
      console.log(`next-translations - Fail translation ${namespace}: ${slug}`);
      return undefined;
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
      console.log(
        `next-translations - Fail type in translation ${namespace}: ${slug}`
      );
      return undefined;
    }
  } else {
    return pathTranslationd;
  }
};

const useTranslation = (namespace: string) => {
  if (!pageTranslations) {
    return {
      t: (slug: string) => {
        console.log(
          `next-translations - Fail translation ${namespace}: ${slug}`
        );
        return undefined;
      },
      tString: (slug: string) => {
        console.log(
          `next-translations - Fail translation ${namespace}: ${slug}`
        );
        return undefined;
      },
      tNumber: (slug: string) => {
        console.log(
          `next-translations - Fail translation ${namespace}: ${slug}`
        );
        return undefined;
      },
      tArray: (slug: string) => {
        console.log(
          `next-translations - Fail translation ${namespace}: ${slug}`
        );
        return undefined;
      },
      tObject: (slug: string) => {
        console.log(
          `next-translations - Fail translation ${namespace}: ${slug}`
        );
        return undefined;
      },
      tComponent: (slug: string, callback: ({}: ICallbackType) => any) => {
        console.log(
          `next-translations - Fail translation ${namespace}: ${slug}`
        );
        return callback({
          textBefore: undefined,
          children: undefined,
          textAfter: undefined,
        });
      },
    };
  }

  const translationsNamespace: IPageTranslationsType | undefined =
    pageTranslations[namespace];

  const t = (slug: string = ""): any => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "any"
    );
  };

  const tString = (slug: string = ""): string | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "string"
    );
  };

  const tNumber = (slug: string = ""): number | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "number"
    );
  };

  const tArray = (slug: string = ""): any[] | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "array"
    );
  };

  const tObject = (slug: string = ""): object | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "object"
    );
  };

  const tComponent = (
    slug: string = "",
    callback: ({}: ICallbackType) => any
  ) => {
    const generatedText: string | undefined = generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "string"
    );

    if (!generatedText) {
      return undefined;
    }

    let componentIndex: number = -1;
    let textBefore = "";
    let textAfter = "";
    let componentText: string | undefined = undefined;

    const generatedTextArray = generatedText.split(" ");

    generatedTextArray.forEach((itemText, indexText) => {
      const hasStartComponent = itemText.includes(
        "<" + translationsConfig.componentNameToReplaced + ">"
      );
      const hasEndComponent = itemText.includes(
        "</" + translationsConfig.componentNameToReplaced + ">"
      );
      const isOnlyComponent = itemText.includes(
        "<" + translationsConfig.componentNameToReplaced + "/>"
      );
      if ((hasStartComponent && hasEndComponent) || isOnlyComponent) {
        componentIndex = indexText;
      }
    });

    if (componentIndex >= 0) {
      generatedTextArray.forEach((itemText, indexText) => {
        if (indexText < componentIndex) {
          textBefore = `${textBefore ? textBefore + " " : ""}${itemText}`;
        } else if (indexText > componentIndex) {
          textAfter = `${textAfter ? " " + textAfter : ""}${itemText}`;
        } else {
          const isOnlyComponent = itemText.includes(
            "<" + translationsConfig.componentNameToReplaced + "/>"
          );
          if (isOnlyComponent) {
            componentText = undefined;
          } else {
            const sliceStartComponent = itemText.slice(
              translationsConfig.componentNameToReplaced.length + 2,
              itemText.length
            );
            const indexEndComponent = sliceStartComponent.lastIndexOf(
              "</" + translationsConfig.componentNameToReplaced + ">"
            );
            componentText = sliceStartComponent.slice(0, indexEndComponent);
          }
        }
      });
    }
    return callback({
      textBefore: textBefore,
      children: componentText,
      textAfter: textAfter,
    });
  };

  return {
    t,
    tString,
    tNumber,
    tArray,
    tObject,
    tComponent,
    pageTranslations,
  };
};

export {initializeTranslations, pageTranslations, useTranslation};
// module.exports = {initializeTranslations, pageTranslations, useTranslation};
