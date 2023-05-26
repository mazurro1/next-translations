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
  query: string;
  hash: string;
};

type TValidLinks = {
  isLoggedUser: boolean;
  path?: string;
  locale: string | undefined;
  router: NextRouter;
  query?: string;
  hash?: string;
};

const validLinkWithLocale = (locale: string, path: string) => {
  if (locale) {
    return `${locale}${path === "/" ? "" : path}`;
  } else {
    return `${path}`;
  }
};

const addQueryAndHashToLink = (link: string, query: string, hash: string) => {
  if (query && hash) {
    return `${link === "" ? "/" : link}?${query}#${hash}`;
  } else if (query) {
    return `${link === "" ? "/" : link}?${query}`;
  } else if (hash) {
    return `${link === "" ? "/" : link}#${hash}`;
  } else {
    return link;
  }
};

const checkRedirects = ({
  isLoggedUser,
  path = "",
  locale,
  router,
  query = "",
  hash = "",
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

  const redirectLink = addQueryAndHashToLink(
    validLinkWithLocale(linkLocale, path),
    query,
    hash
  );

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
      const linkRedirectOnSuccess = addQueryAndHashToLink(
        validLinkWithLocale(
          linkLocale,
          translationsConfig.redirectForLoggedUser
        ),
        query,
        hash
      );
      return {
        value: ERedirect.siteForLoggedUser_pathNotForLoggedUser,
        path: linkRedirectOnSuccess,
      };
    }
  } else {
    if (isSiteForLoggedUser) {
      const linkRedirectOnFailure = addQueryAndHashToLink(
        validLinkWithLocale(
          linkLocale,
          translationsConfig.redirectForNotLoggedUser
        ),
        query,
        hash
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
  withQuery = true,
  withHash = true,
}: {
  isLoggedUser: boolean;
  enable: boolean;
  withQuery?: boolean;
  withHash?: boolean;
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

    let queryValue = "";
    if (withQuery) {
      if (window.location.search.length > 0) {
        const splitQuery = window.location.search.split("?");
        const getQueryValue = splitQuery.at(1);
        if (getQueryValue) {
          queryValue = getQueryValue;
        }
      }
    }

    let hashValue = "";
    if (withHash) {
      if (window.location.hash.length > 0) {
        const splitHash = window.location.hash.split("#");
        const getHashValue = splitHash.at(1);
        if (getHashValue) {
          hashValue = getHashValue;
        }
      }
    }

    const result = checkRedirects({
      isLoggedUser: isLoggedUser,
      locale: undefined,
      path: linkWithoutLocale,
      router: router,
      query: queryValue,
      hash: hashValue,
    });

    if (router.asPath !== result.path) {
      router.push(result.path);
    }
    return;
  }, [isLoggedUser, router.asPath, translationsConfig, enable]);
};

const validLink = ({
  isLoggedUser,
  path,
  locale,
  router,
  query = "",
  hash = "",
}: TValidLinks) => {
  const defaultLocaleWithMultirouting: boolean =
    translationsConfig.defaultLocaleWithMultirouting;
  const validLocale = defaultLocaleWithMultirouting
    ? locale
    : translationsConfig.defaultLocale === locale
    ? undefined
    : locale;

  let linkWithoutLocale = path;
  if (!linkWithoutLocale) {
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
  }

  const result = checkRedirects({
    isLoggedUser,
    path: linkWithoutLocale,
    locale: validLocale,
    router,
    query,
    hash,
  });

  return result.path;
};

export {InitializeRedirectsTranslations, validLink};
