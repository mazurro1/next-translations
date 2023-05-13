/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect} from "react";

import {useRouter} from "next/router";

//@ts-ignore
import translationsConfigUser from "../../translations.config.js";

const translationsConfig = {
  defaultLocale: translationsConfigUser?.defaultLocale || "en",
  errorPagePath: translationsConfigUser?.errorPagePath || "/404",
  componentNameToReplaced:
    translationsConfigUser?.componentNameToReplaced || "TComponent",
  redirectForLoggedUser: translationsConfigUser?.redirectForLoggedUser || "/",
  redirectForNoLoggedUser:
    translationsConfigUser?.redirectForNoLoggedUser || "/",
  sitesForLoggedUser: translationsConfigUser?.sitesForLoggedUser || [],
  defaultLocaleWithMultirouting:
    translationsConfigUser?.defaultLocaleWithMultirouting,
};

type TPageTranslations = {
  [key: string]: any;
};

type TType = "string" | "number" | "array" | "object" | "any";

type TCallback = {
  textBefore: string | undefined;
  textComponent: string | undefined;
  textAfter: string | undefined;
};

type TInitializeTranslations = {
  translations: TPageTranslations;
};

let pageTranslations: TPageTranslations | null = null;

const resolvePath = (object: any, path: string, defaultValue = undefined) =>
  path.split(".").reduce((o, p) => (o ? o[p] : defaultValue), object);

const initializeTranslations = (translations: TInitializeTranslations) => {
  pageTranslations = translations;
};

const InitializeRedirectsTranslations = ({
  isLoggedUser,
}: {
  isLoggedUser: boolean;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedUser === undefined || !router.isReady) {
      return;
    }

    const actualPath = router.route;
    const selectedLocale = router?.query?.locale as string | undefined;
    const defaultLocaleWithMultirouting: boolean =
      translationsConfig.defaultLocaleWithMultirouting;

    const linkLocale = selectedLocale
      ? `/${selectedLocale}`
      : defaultLocaleWithMultirouting
      ? `/${translationsConfig.defaultLocale}`
      : "";

    let linkWithoutLocale: string | undefined = "";

    if (router.pathname.includes("[locale]")) {
      const splitPathname = router.pathname.split("/[locale]");
      linkWithoutLocale = splitPathname.at(1);
    } else {
      linkWithoutLocale =
        router.pathname === "/" && !!linkLocale ? "" : router.pathname;
    }

    const redirectLink = `${linkLocale}${linkWithoutLocale}`;

    const isErrorPage = router.pathname === translationsConfig?.errorPagePath;

    const isSiteForLoggedUser =
      translationsConfig.sitesForLoggedUser.find((itemRoute: string) => {
        if (!!linkLocale) {
          if (
            `${linkLocale}${itemRoute === "/" ? "" : itemRoute}` ===
            redirectLink
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          if (itemRoute === linkWithoutLocale) {
            return true;
          } else {
            return false;
          }
        }
      }) !== undefined;

    if (isLoggedUser) {
      if (isSiteForLoggedUser) {
        if (redirectLink !== actualPath) {
          if (!isErrorPage) {
            router.push(redirectLink);
          }
        }
        return;
      } else {
        const linkRedirectOnSuccess = `${linkLocale}${translationsConfig.redirectForLoggedUser}`;

        if (actualPath !== linkRedirectOnSuccess) {
          if (!isErrorPage) {
            router.push(linkRedirectOnSuccess);
          }
        }
        return;
      }
    } else {
      if (isSiteForLoggedUser) {
        const linkRedirectOnFailure = `${linkLocale}${translationsConfig.redirectForNoLoggedUser}`;
        if (actualPath !== linkRedirectOnFailure) {
          if (!isErrorPage) {
            router.push(linkRedirectOnFailure);
          }
        }
        return;
      } else {
        if (redirectLink !== actualPath) {
          if (!isErrorPage) {
            router.push(redirectLink);
          }
        }
        return;
      }
    }
  }, [isLoggedUser, router.asPath, translationsConfig]);
};

const checkTypesAndReturn = (type: TType, value: any) => {
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
  translationsNamespace: TPageTranslations | undefined,
  namespace: string,
  type: TType
) => {
  if (!translationsNamespace) {
    console.log(`next-translations - fail load namespace: ${namespace}`);
    return undefined;
  }
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
      tComponent: (slug: string, callback: ({}: TCallback) => any) => {
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

  const replacePathFromNamespace = namespace.replace(":", ".");

  const translationsNamespace: TPageTranslations | undefined = resolvePath(
    pageTranslations,
    replacePathFromNamespace,
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

  const tComponent = (slug = "", callback: ({}: TCallback) => any) => {
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

export {
  initializeTranslations,
  InitializeRedirectsTranslations,
  pageTranslations,
  useTranslation,
};
