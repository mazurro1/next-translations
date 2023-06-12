/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

//@ts-ignore
import translationsConfigUser from "../../translations.config.js";

const translationsConfig = {
  defaultLocale: translationsConfigUser?.defaultLocale || "en",
  errorPagePath: translationsConfigUser?.errorPagePath || "/404",
  componentNameToReplaced:
    translationsConfigUser?.componentNameToReplaced || "TComponent",
  redirectForLoggedUser: translationsConfigUser?.redirectForLoggedUser || "/",
  redirectForNotLoggedUser:
    translationsConfigUser?.redirectForNotLoggedUser || "/",
  sitesForLoggedUser: translationsConfigUser?.sitesForLoggedUser || [],
  defaultLocaleWithMultirouting:
    translationsConfigUser?.defaultLocaleWithMultirouting,
};

export type T_PageTranslations = {
  [key: string]: any;
};

type T_Type = "string" | "number" | "array" | "object" | "any";

type T_Callback = {
  textBefore: string | undefined;
  textComponent: string | undefined;
  textAfter: string | undefined;
};

type T_InitializeTranslations = {
  translations: T_PageTranslations;
};

export type T_t =
  | ((slug: string) => undefined)
  | ((slug?: string | undefined) => any | undefined);

export type T_tString =
  | ((slug: string) => undefined)
  | ((slug?: string | undefined) => string | undefined);

export type T_tNumber =
  | ((slug: string) => undefined)
  | ((slug?: string | undefined) => number | undefined);

export type T_tArray =
  | ((slug: string) => undefined)
  | ((slug?: string | undefined) => any[] | undefined);

export type T_tObject =
  | ((slug: string) => undefined)
  | ((slug?: string | undefined) => object | undefined);

export type T_tComponent =
  | ((slug: string, callback: ({}: T_Callback) => any) => any)
  | ((slug: string | undefined, callback: ({}: T_Callback) => any) => any);

let pageTranslations: T_PageTranslations | null = null;

const resolvePath = (object: any, path: string, defaultValue = undefined) =>
  path.split(".").reduce((o, p) => o?.[p] ?? defaultValue, object);

const initializeTranslations = (translations: T_InitializeTranslations) => {
  pageTranslations = translations;
};

const checkTypesAndReturn = (type: T_Type, value: any) => {
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
  namespace: string,
  type: T_Type
) => {
  const replacePathFromNamespace = namespace.replace(":", ".");

  if (!pageTranslations) {
    console.log(
      `next-translations - No detected translations for this page ${namespace}: ${slug}`
    );
    return undefined;
  }

  const translationsNamespace: T_PageTranslations | undefined = resolvePath(
    pageTranslations,
    replacePathFromNamespace,
    undefined
  );

  const replaceSlugPathFromNamespace = slug.replace(":", ".");

  const pathTranslated = resolvePath(
    translationsNamespace,
    replaceSlugPathFromNamespace,
    undefined
  );

  if (pathTranslated === undefined) {
    console.log(`next-translations - Fail translation ${namespace}: ${slug}`);
    return undefined;
  }

  if (type) {
    const validPathTranslted = checkTypesAndReturn(type, pathTranslated);
    if (validPathTranslted !== undefined) {
      return validPathTranslted;
    } else {
      console.log(
        `next-translations - Fail type in translation ${namespace}: ${slug}`
      );
      return undefined;
    }
  } else {
    return pathTranslated;
  }
};

const useTranslation = (namespace: string) => {
  const replacePathFromNamespace = namespace.replace(":", ".");

  const translationsNamespace: T_PageTranslations | undefined = resolvePath(
    pageTranslations,
    replacePathFromNamespace,
    undefined
  );

  if (!translationsNamespace) {
    console.log(
      `next-translations - fail load namespace: ${namespace}. Probably that the given namespace is missing from the folder in your namespaces or it is spelled incorrectly. Another reason may be the translations have been cached and need to refresh the page!`
    );
    return {
      t: () => {
        return undefined;
      },
      tString: () => {
        return undefined;
      },
      tNumber: () => {
        return undefined;
      },
      tArray: () => {
        return undefined;
      },
      tObject: () => {
        return undefined;
      },
      tComponent: (_slug: string, callback: ({}: T_Callback) => any) => {
        return callback({
          textBefore: undefined,
          textComponent: undefined,
          textAfter: undefined,
        });
      },
    };
  }

  const t: T_t = (slug = ""): any => {
    return generateTranslationWithType(slug, namespace, "any");
  };

  const tString: T_tString = (slug = ""): string | undefined => {
    return generateTranslationWithType(slug, namespace, "string");
  };

  const tNumber: T_tNumber = (slug = ""): number | undefined => {
    return generateTranslationWithType(slug, namespace, "number");
  };

  const tArray: T_tArray = (slug = ""): any[] | undefined => {
    return generateTranslationWithType(slug, namespace, "array");
  };

  const tObject: T_tObject = (slug = ""): object | undefined => {
    return generateTranslationWithType(slug, namespace, "object");
  };

  const tComponent: T_tComponent = (
    slug = "",
    callback: ({}: T_Callback) => any
  ) => {
    const generatedText: string | undefined = generateTranslationWithType(
      slug,
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
