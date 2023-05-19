/* eslint-disable @typescript-eslint/ban-ts-comment */
import {useEffect} from "react";

import {useRouter, NextRouter} from "next/router";

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
  sitedForLoggedAndNotLoggedUser:
    translationsConfigUser?.sitedForLoggedAndNotLoggedUser || [],
  defaultLocaleWithMultirouting:
    translationsConfigUser?.defaultLocaleWithMultirouting,
};

enum ERedirect {
  siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser = "siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser",
  siteForLoggedUser_pathForLoggedUser = "siteForLoggedUser_pathForLoggedUser",
  siteForLoggedUser_pathNotForLoggedUser = "siteForLoggedUser_pathNotForLoggedUser",
  siteNotForLoggedUser_pathForLoggedUser = "siteNotForLoggedUser_pathForLoggedUser",
  siteNotForLoggedUser_pathNotForLoggedUser = "siteNotForLoggedUser_pathNotForLoggedUser",
}

type TCheckRedirect = {
  isLoggedUser: boolean;
  path: string;
  locale: string | undefined;
  router: NextRouter;
};

const validLinkWithLocale = (locale: string, path: string) => {
  if (locale) {
    return `${locale}${path === "/" ? "" : path}`;
  } else {
    return `${path}`;
  }
};

const checkRedirects = ({
  isLoggedUser,
  path = "",
  locale,
  router,
}: TCheckRedirect) => {
  const selectedLocale =
    locale ?? (router?.query?.locale as string | undefined);
  const defaultLocaleWithMultirouting: boolean =
    translationsConfig.defaultLocaleWithMultirouting;

  const linkLocale = selectedLocale
    ? `/${selectedLocale}`
    : defaultLocaleWithMultirouting
    ? `/${translationsConfig.defaultLocale}`
    : "";

  const redirectLink = validLinkWithLocale(linkLocale, path);

  const isSiteForLoggedUser =
    translationsConfig.sitesForLoggedUser.find((itemRoute: string) => {
      if (!!linkLocale) {
        if (validLinkWithLocale(linkLocale, itemRoute) === redirectLink) {
          return true;
        } else {
          return false;
        }
      } else {
        if (itemRoute === path) {
          return true;
        } else {
          return false;
        }
      }
    }) !== undefined;

  const isSiteForLoggedAndNotLoggedUser =
    translationsConfig.sitedForLoggedAndNotLoggedUser.find(
      (itemRoute: string) => {
        if (!!linkLocale) {
          if (validLinkWithLocale(linkLocale, itemRoute) === redirectLink) {
            return true;
          } else {
            return false;
          }
        } else {
          if (itemRoute === path) {
            return true;
          } else {
            return false;
          }
        }
      }
    ) !== undefined;

  if (isSiteForLoggedAndNotLoggedUser) {
    return {
      value:
        ERedirect.siteForLoggedAndNotLoggedUser_pathForLoggedAndNotLoggedUser,
      path: redirectLink,
    };
  }

  if (isLoggedUser) {
    if (isSiteForLoggedUser) {
      return {
        value: ERedirect.siteForLoggedUser_pathForLoggedUser,
        path: redirectLink,
      };
    } else {
      const linkRedirectOnSuccess = validLinkWithLocale(
        linkLocale,
        translationsConfig.redirectForLoggedUser
      );
      return {
        value: ERedirect.siteForLoggedUser_pathNotForLoggedUser,
        path: linkRedirectOnSuccess,
      };
    }
  } else {
    if (isSiteForLoggedUser) {
      const linkRedirectOnFailure = validLinkWithLocale(
        linkLocale,
        translationsConfig.redirectForNotLoggedUser
      );
      return {
        value: ERedirect.siteNotForLoggedUser_pathForLoggedUser,
        path: linkRedirectOnFailure,
      };
    } else {
      return {
        value: ERedirect.siteNotForLoggedUser_pathNotForLoggedUser,
        path: redirectLink,
      };
    }
  }
};

const InitializeRedirectsTranslations = ({
  isLoggedUser,
  enable = true,
}: {
  isLoggedUser: boolean;
  enable: boolean;
}) => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || !enable) {
      return;
    }

    const isErrorPage = router.pathname === translationsConfig?.errorPagePath;

    if (isErrorPage) {
      return;
    }

    let linkWithoutLocale = "";
    if (router.pathname.includes("[locale]")) {
      const splitPathname = router.pathname.split("/[locale]");
      const selectedPath = splitPathname.at(1);
      if (selectedPath) {
        linkWithoutLocale = selectedPath;
      } else {
        linkWithoutLocale = "/";
      }
    } else {
      linkWithoutLocale = router.pathname;
    }

    const result = checkRedirects({
      isLoggedUser: isLoggedUser,
      locale: undefined,
      path: linkWithoutLocale,
      router: router,
    });

    if (router.asPath !== result.path) {
      router.push(result.path);
    }
    return;
  }, [isLoggedUser, router.asPath, translationsConfig, enable]);
};

const validLink = ({isLoggedUser, path, locale, router}: TCheckRedirect) => {
  const defaultLocaleWithMultirouting: boolean =
    translationsConfig.defaultLocaleWithMultirouting;
  const validLocale = defaultLocaleWithMultirouting
    ? locale
    : translationsConfig.defaultLocale === locale
    ? undefined
    : locale;

  const result = checkRedirects({
    isLoggedUser,
    path,
    locale: validLocale,
    router,
  });

  return result.path;
};

export {InitializeRedirectsTranslations, validLink};
