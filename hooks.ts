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
  textComponent: string | undefined;
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
          textComponent: undefined,
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

    let componentStartIndex = -1;
    let componentEndIndex = -1;
    let componentOnlyIndex = -1;

    let text = "";
    let textBefore = "";
    let textAfter = "";
    let textComponent: string | undefined = undefined;

    const generatedTextArray = generatedText.split(" ");

    generatedTextArray.forEach((itemText, indexText) => {
      const isStartComponent =
        itemText === "<" + translationsConfig.componentNameToReplaced + ">";
      if (isStartComponent) {
        componentStartIndex = indexText;

        return;
      }

      const isEndComponent =
        itemText === "</" + translationsConfig.componentNameToReplaced + ">";
      if (isEndComponent) {
        componentEndIndex = indexText;

        return;
      }

      const isOnlyComponent =
        itemText === "<" + translationsConfig.componentNameToReplaced + "/>";
      if (isOnlyComponent) {
        componentOnlyIndex = indexText;
        return;
      }
    });

    generatedTextArray.forEach((itemText, indexText) => {
      if (
        componentOnlyIndex === -1 &&
        componentStartIndex >= 0 &&
        componentEndIndex >= 0
      ) {
        if (indexText < componentStartIndex) {
          textBefore = `${textBefore ? textBefore + " " : ""}${itemText}`;
        } else if (
          indexText > componentStartIndex &&
          indexText < componentEndIndex
        ) {
          textComponent = `${
            textComponent ? textComponent + " " : ""
          }${itemText}`;
        } else if (indexText > componentEndIndex) {
          textAfter = `${textAfter ? textAfter + " " : ""}${itemText}`;
        }
      } else if (componentOnlyIndex >= 0) {
        if (indexText < componentOnlyIndex) {
          textBefore = `${textBefore ? textBefore + " " : ""}${itemText}`;
        } else if (indexText > componentOnlyIndex) {
          textAfter = `${textAfter ? textAfter + " " : ""}${itemText}`;
        }
      } else {
        text = `${text ? text + " " : ""}${itemText}`;
      }
    });

    return callback({
      textBefore,
      textComponent,
      textAfter,
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
