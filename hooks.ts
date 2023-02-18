import fse from "fs-extra";
import path from "path";
// const fse = require("fs-extra");
// const path = require("path");

const exists = await fse.pathExists(
  path.resolve(__dirname, `../../translations.config.ts`)
);

type TranslationsConfigType = {
  componentNameToReplaced?: string;
};

let translationsConfigUser: TranslationsConfigType | undefined = undefined;

if (exists) {
  translationsConfigUser = path.resolve(
    __dirname,
    `../../translations.config.ts`
  ) as TranslationsConfigType;
} else {
  console.log(`next-translations - fail on load translations.config.ts`);
}

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

const resolvePath = (object: any, path: string, defaultValue = undefined) =>
  path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);

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

  const pathTranslated = resolvePath(translationsNamespace, slug, undefined);

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
  if (!pageTranslations) {
    return {
      t: (slug: string) => {
        console.log(
          `next-translations - No detected translations for this page ${namespace}: ${slug}`
        );
        return undefined;
      },
      tString: (slug: string) => {
        console.log(
          `next-translations - No detected translations for this page ${namespace}: ${slug}`
        );
        return undefined;
      },
      tNumber: (slug: string) => {
        console.log(
          `next-translations - No detected translations for this page ${namespace}: ${slug}`
        );
        return undefined;
      },
      tArray: (slug: string) => {
        console.log(
          `next-translations - No detected translations for this page ${namespace}: ${slug}`
        );
        return undefined;
      },
      tObject: (slug: string) => {
        console.log(
          `next-translations - No detected translations for this page ${namespace}: ${slug}`
        );
        return undefined;
      },
      tComponent: (slug: string, callback: ({}: ICallbackType) => any) => {
        console.log(
          `next-translations - No detected translations for this page ${namespace}: ${slug}`
        );
        return callback({
          textBefore: undefined,
          textComponent: undefined,
          textAfter: undefined,
        });
      },
    };
  }

  const translationsNamespace: IPageTranslationsType | undefined = resolvePath(
    pageTranslations,
    namespace,
    undefined
  );

  const t = (slug = ""): any => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "any"
    );
  };

  const tString = (slug = ""): string | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "string"
    );
  };

  const tNumber = (slug = ""): number | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "number"
    );
  };

  const tArray = (slug = ""): any[] | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "array"
    );
  };

  const tObject = (slug = ""): object | undefined => {
    return generateTranslationWithType(
      slug,
      translationsNamespace,
      namespace,
      "object"
    );
  };

  const tComponent = (slug = "", callback: ({}: ICallbackType) => any) => {
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
