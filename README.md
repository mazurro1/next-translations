# next-translations

Thanks to this package you will be able to add to your website written in **NextJS** to **download/manage** translations on your website! Thanks to this package you will be able to build a very efficient website that will have generated **pages WITH nested translations!**. Powerful package also for **STATIC** and **SERVER SIDE RENDERING** sites in **NextJS**! Works **without i18n**!

#### install translations

```bash
npm i next-translations
```

#### translations.config.js - you need to add this config file to your project

| Parameter                        | Type                                                               | Default             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :------------------------------- | :----------------------------------------------------------------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultLocale`                  | `string`                                                           | `'en'`              | **Required**. The default language on your site                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `locales`                        | `string[]`                                                         | `['en']`            | **Required**. All available languages on your website.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `sitesForLoggedUser`             | `string[]`                                                         | `[]`                | All paths available ONLY for the active session                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `sitedForLoggedAndNotLoggedUser` | `string[]`                                                         | `[]`                | All paths available for the all sessions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `redirectForLoggedUser`          | `string`                                                           | `'/'`               | Redirects the user when on a route for non-logged in users                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `redirectForNotLoggedUser`       | `string`                                                           | `'/'`               | Redirects the user when in the route for logged in users                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `errorPagePath`                  | `string`                                                           | `'/404'`            | Showing if we have a custom link to the error page so that unnecessary redirects are not made                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `outputFolderTranslations`       | `string`                                                           | `'/public/locales'` | The path to your translations. **NOTE**: If you download translations using next-translations, they will be saved to the given address. For the site to work properly, they **must be** in the `/public` folder.                                                                                                                                                                                                                                                                                                                                     |
| `defaultLocaleWithMultirouting`  | `boolean`                                                          | `undefined`         | The language to be excluded from multi routing. For example, we want /index.js to have the language from defaultLocale prop, then it should be substituted into this variable. Other languages (if any) will be available in `/pages/[locale]`                                                                                                                                                                                                                                                                                                       |
| `constNamespaces`                | `string[]`                                                         | `['common']`        | These are all the namespaces we use throughout the project so as not to define them on every page.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `componentNameToReplaced`        | `string`                                                           | `'TComponent'`      | The name of the component in translations that will be captured and replaced in tComponent.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `namespacesToFetch`              | `string[]`                                                         | `['common']`        | All the namespaces you want to fetch during link Fetch Translations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `linkFetchTranslations`          | `(version: string, language: string, namespace: string) => string` | `undefined`         | A function to download our translations **from the api**. It is called every time it wants to load a given translation in a given language and namespace. The function returns single values that we entered in the fields: `locales`, `namespaces`. To return, we need to return a link to our api, e.g. **return** `https://your-api-to-download-translations/${version}/${language}/${namespace}` Note: if you add NEXT_PUBLIC_NEXT_TRANSLATIONS_APP_ENV to your .env file then you can access the version of the page, e.g.: dev, int, prd etc.. |

## configuration

**Attention!** To avoid a translation error when building a page, add getTranslationsProps to each page! If you don't have these pages, you may get messages about no translation!

- /404
- /500
- /offline

**example translations in /public/locales/en/common.json**

```bash
{
  "section":{
    "title": "Example title in your site!"
  }
}
```

**/pages/\_app.tsx** for **STATIC SITES** and **SERVER SIDE RENDERING**

```bash
import { initializeTranslations } from "next-translations/hooks";
import { InitializeRedirectsTranslations, validLink } from "next-translations/redirects";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {

  // add this line
  initializeTranslations(pageProps?.translations);

  // add this lint if you want to use redirects: sitesForLoggedUser.
  // You can add this in user context for example.
  InitializeRedirectsTranslations({
    isLoggedUser: true, // true or false for STATIC PAGES. Attention! if isLoggedUser is undefined then no redirects are performed!
    isLoggedUser: pageProps?.isLoggedUser || false, // for SERVER SIDE RENDERING pages. Attention! if isLoggedUser is undefined then no redirects are performed!
    enable: true, // default is true. Checks if routing can be done on the page. If it's false, it doesn't do routing.
    withQuery: true, // default is true. Listens for query during redirects
    withHash: true, // default is true. Listens for hash during redirects
  });

  //example
  InitializeRedirectsTranslations({
    isLoggedUser: !!user,
    enable: user !== undefined,
    withQuery: true,
    withHash: false,
  });

  //checking routes and return valid route
  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let queryValue = "";
    if (window.location.search.length > 0) {
      const splitQuery = window.location.search.split("?");
      const getQueryValue = splitQuery.at(1);
      if (getQueryValue) {
        queryValue = getQueryValue;
      }
    }

    let hashValue = "";
    if (window.location.hash.length > 0) {
      const splitHash = window.location.hash.split("#");
      const getHashValue = splitHash.at(1);
      if (getHashValue) {
        hashValue = getHashValue;
      }
    }

    // works in the same way as page redirects. If the user does not have access to a given subpage, he will return a link to the subpage to which he has based on the config
    const result = validLink({
      isLoggedUser: false, // checking if the user is logged in
      locale: "en", // the locale we want to change to. If is undefined, the locale is selected based on the currently used one
      path: "/user", // path where we want to generate the link. If is undefined, the locale is selected based on the currently used one
      router: router, // need to add router from nextjs
      query: queryValue, // query to your link.
      hash: hashValue, // hash to your link
    });
  }, [router, user]);

  return (
    <main>
        <Component {...pageProps} />
    </main>
  );
}
```

**/pages/yourPath.tsx** - for **STATIC SITES**

`Note: if you don't have defaultLocaleWithMultirouting defined, then you MUST keep content in /pages/[locale]/yourPath.tsx, otherwise you will only have the language that was set as defaultLocale!`

```bash
import { getTranslationsProps } from "next-translations";
import { useTranslation } from "next-translations/hooks";
import { GetStaticProps } from "next";

function Home() {
  const { t, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section
  const { t, pageTranslations } = useTranslation("common:section"); // if you want you can also refer to namespace, along with nested elements - 1 example
  const { t, pageTranslations } = useTranslation("common.section"); // if you want you can also refer to namespace, along with nested elements - 2 example

  // t -> thanks to this function, you can download a given text/object/array at your discretion - just like you have downloaded/added in translations

  // pageTranslations -> all translations that are available on this subpage

  return (
    <div>
      t("section.title") // downloading translation - without nested elements
      t("title") // downloading translation - if you using nested elements
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ctx => {
  const translationsProps = await getTranslationsProps(ctx, ["common"]); // add here all translations in string[] that you use on this subpage

  // you have access to:
  // ctx.locale - current locale
  // ctx.locales - all locales
  // ctx.defaultLocale - default locale

  return {
    props: {
      ...translationsProps,
    },
  };
}

export default Home;

```

**/pages/yourPath.tsx** - for **SERVER SIDE RENDERING**

`Note: if you don't have defaultLocaleWithMultirouting defined, then you MUST keep content in /pages/[locale]/yourPath.tsx, otherwise you will only have the language that was set as defaultLocale!`

```bash
import { getTranslationsProps } from "next-translations";
import { useTranslation } from "next-translations/hooks";
import { GetServerSideProps } from "next";

function Home() {
  const { t, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section
  const { t, pageTranslations } = useTranslation("common:section"); // if you want you can also refer to namespace, along with nested elements - 1 example
  const { t, pageTranslations } = useTranslation("common.section"); // if you want you can also refer to namespace, along with nested elements - 2 example

  // t -> thanks to this function, you can download a given text/object/array at your discretion - just like you have downloaded/added in translations

  // pageTranslations -> all translations that are available on this subpage

  return (
    <div>
      t("section.title") // downloading translation - without nested elements
      t("title") // downloading translation - if you using nested elements
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async ctx => {
  const translatesProps = await getTranslationsProps(ctx, ["common"]); // add here all translations in string[] that you use on this subpage

  // you have access to:
  // ctx.locale - current locale
  // ctx.locales - all locales
  // ctx.defaultLocale - default locale

  return {
    props: {
      ...translatesProps,
      isLoggedUser: true, // or false, add this prop if you want to use redirects: sitesForLoggedUser
    },
  };
};

export default Home;

```

**/pages/[locale]/yourPath.tsx** - for **STATIC SITES**

```bash
import { getTranslationsProps, getStaticPaths, getPaths } from "next-translations"; // add getStaticPaths only if you using: export { getStaticPaths }, if you using getStaticPaths from next - dont add this import!
import { useTranslation } from "next-translations/hooks";
import { GetStaticProps, GetStaticPaths } from "next";

function Home() {
  const { t, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section
  const { t, pageTranslations } = useTranslation("common:section"); // if you want you can also refer to namespace, along with nested elements - 1 example
  const { t, pageTranslations } = useTranslation("common.section"); // if you want you can also refer to namespace, along with nested elements - 2 example

  // t -> thanks to this function, you can download a given text/object/array at your discretion - just like you have downloaded/added in translations

  // pageTranslations -> all translations that are available on this subpage

  return (
    <div>
      t("section.title") // downloading translation - without nested elements
      t("title") // downloading translation - if you using nested elements
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ctx => {
  const translationsProps = await getTranslationsProps(ctx, ["common"]); // add here all translations in string[] that you use on this subpage

  // you have access to:
  // ctx.locale - current locale
  // ctx.locales - all locales
  // ctx.defaultLocale - default locale

  return {
    props: {
      ...translationsProps,
    },
  };
}


export { getStaticPaths }; // IMPORTANT ADD THIS LINE TO ENABLE MULTI ROUTING


//ALTERNATIVE with Nextjs getStaticPaths - if you using this, don't impoty getStaticPaths from next-translations

export const getStaticPaths: GetStaticPaths = async () => { // IMPORTANT ADD THIS LINE TO ENABLE MULTI ROUTING (alternative)
  return {
    fallback: false,
    paths: getPaths(),
  };
}

export default Home;

```

**/pages/[locale]/yourPath.tsx** - for **SERVER SIDE RENDERING**

`Attention! You manage the site's languages via slug! eg: /en/home - page with en language, /pl/home - page with pl language`

```bash
import { getTranslationsProps } from "next-translations";
import { useTranslation } from "next-translations/hooks";
import { GetServerSideProps } from "next";

function Home() {
  const { t, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section
  const { t, pageTranslations } = useTranslation("common", true); // translations without log errors
  const { t, pageTranslations } = useTranslation("common:section"); // if you want you can also refer to namespace, along with nested elements - 1 example
  const { t, pageTranslations } = useTranslation("common.section"); // if you want you can also refer to namespace, along with nested elements - 2 example

  // t -> thanks to this function, you can download a given text/object/array at your discretion - just like you have downloaded/added in translations

  // pageTranslations -> all translations that are available on this subpage

  return (
    <div>
      t("section.title") // downloading translation - without nested elements
      t("title") // downloading translation - if you using nested elements
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const translatesProps = await getTranslationsProps(ctx, ["common"]); // add here all translations in string[] that you use on this subpage

  // you have access to:
  // ctx.locale - current locale
  // ctx.locales - all locales
  // ctx.defaultLocale - default locale

  return {
    props: {
      ...translatesProps,
      isLoggedUser: true, // or false, add this prop if you want to use redirects: sitesForLoggedUser
    },
  };
};

export default Home;

```

**useTranslation - all functions**

```bash
const { t, tString, tNumber, tArray, tObject, tComponent, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section
const { t, pageTranslations } = useTranslation("common:section"); // if you want you can also refer to namespace, along with nested elements - 1 example
const { t, pageTranslations } = useTranslation("common.section"); // if you want you can also refer to namespace, along with nested elements - 2 example

pageTranslations // all translations that are available on this subpage

t("section.text1"); // if there is a translation, it returns it as any, if not, it returns undefined

tString("section.text2"); // if there is a translation and it has a string type, it returns it as string, if it doesn't find it, or it has the wrong type, it returns undefined.

tNumber("section.text3"); // if there is a translation and it has a number type, it returns it as number, if it doesn't find it, or it has the wrong type, it returns undefined.

tArray("section.text4"); // if there is a translation and it has a any[] type, it returns it as any[], if it doesn't find it, or it has the wrong type, it returns undefined.

tObject("section.text5"); // if there is a translation and it has a object type, it returns it as object, if it doesn't find it, or it has the wrong type, it returns undefined.


//if there is a translation and it has type string, if it doesn't find it or it has wrong type it returns undefined. If it contains <TComponent> value </TComponent> or <TComponent/>, you can create your own component based on the values returned from the callback. **Note** the text inside <TComponent> must be separated by a space between <TComponent> and </TComponent>!!!!! Example of correct implementation:
{
  "title": "example paragraph <TComponent> xxxx sad </TComponent> paragraph"
}
tComponent(
  "section.textLink",
  ({ textBefore, textComponent, textAfter, text }) => { // value from callback to create your own component. text is returned when it doesn't find a TComponent inside the text
    return (
      <div>
        <p>{textBefore}</p>
        <Link href="/">{textComponent}</Link>
        <p>{textAfter}</p>
      </div>
    );
  },
);

```

**Avaible types**

```bash
// import type {T_t, T_tString, T_tNumber, T_tArray, T_tObject, T_tComponent} from "next-translations/hooks"

- T_t
- T_tString
- T_tNumber
- T_tArray
- T_tObject
- T_tComponent
```

**package.json**

```bash
"scripts": {
    "getTranslations": "node node_modules/next-translations/getTranslations", // script to fetch all translations from your api **linkFetchTranslations**
    "dev": "npm run getTranslations && next dev",
    "build": "npm run getTranslations && next build",
}
```
