# next-translations

Thanks to this package you will be able to add to your website written in **NextJS** to **download/manage** translations on your website! Thanks to this package you will be able to build a very efficient website that will have generated **pages WITH nested translations!**. Powerful package also for **STATIC pages** in **NextJS**!

#### install translations

```bash
npm i next-translations
```

#### translations.config.js - you need to add this config file to your project

| Parameter                     | Type                                              | Default             | Description                                                                                                                                                                                                                                                                                                                                                                                   |
| :---------------------------- | :------------------------------------------------ | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultLocale`               | `string`                                          | `'en'`              | **Required**. The default language on your site                                                                                                                                                                                                                                                                                                                                               |
| `locales`                     | `string[]`                                        | `['en']`            | **Required**. All available languages on your website.                                                                                                                                                                                                                                                                                                                                        |
| `outputFolderTranslations`    | `string`                                          | `'/public/locales'` | The path to your translations. **NOTE**: If you download translations using next-translations, they will be saved to the given address. For the site to work properly, they **must be** in the `/public` folder.                                                                                                                                                                              |
| `languageWithoutMultirouting` | `string`                                          | `undefined`         | The language to be excluded from multi routing. For example, we want /index.js to have the language **"pl" by default**, then it should be substituted into this variable. Other languages (if any) will be available in `/pages/[locale]`                                                                                                                                                    |
| `constNamespaces`             | `string[]`                                        | `['common']`        | These are all the namespaces we use throughout the project so as not to define them on every page.                                                                                                                                                                                                                                                                                            |
| `namespaces`                  | `string[]`                                        | `['common']`        | All the namespaces we use in our repository.                                                                                                                                                                                                                                                                                                                                                  |
| `componentNameToReplaced`     | `string`                                          | `TComponent`        | The name of the component in translations that will be captured and replaced in tComponent.                                                                                                                                                                                                                                                                                                   |
| `linkFetchTranslations`       | `(language: string, namespace: string) => string` | `undefined`         | A function to download our translations **from the api**. It is called every time it wants to load a given translation in a given language and namespace. The function returns single values that we entered in the fields: `locales`, `namespaces`. To return, we need to return a link to our api, e.g. **return** `https://your-api-to-download-translations/dev/${language}/${namespace}` |

## configuration

**example translations in /public/locales/en/common.json**

```bash
{
  "section":{
    "title": "Example title in your site!"
  }
}
```

**/pages/\_app.tsx**

```bash
import { initializeTranslations } from "next-translations/hooks";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {

  // add this line
  initializeTranslations(pageProps?.translations);

  return (
    <main>
        <Component {...pageProps} />
    </main>
  );
}
```

**/pages/yourPath.tsx**

```bash
import { getTranslationsProps } from "next-translations";
import { useTranslation } from "next-translations/hooks";
import { GetStaticProps } from "next";

function Home() {
  const { t, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section

  // t -> thanks to this function, you can download a given text/object/array at your discretion - just like you have downloaded/added in translations

  // pageTranslations -> all transactions that are available on this subpage

  return (
    <div>
      t("section.title") // downloading translation
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ctx => {
  const translationsProps = await getTranslationsProps(ctx, ["common"]); // add here all transactions in string[] that you use on this subpage

  return {
    props: {
      ...translationsProps,
    },
  };
}

export default Home;


```

**/pages/[locale]/yourPath.tsx**

```bash
import { getTranslationsProps, getStaticPaths } from "next-translations";
import { useTranslation } from "next-translations/hooks";
import { GetStaticProps } from "next";

function Home() {
  const { t, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section

  // t -> thanks to this function, you can download a given text/object/array at your discretion - just like you have downloaded/added in translations

  // pageTranslations -> all transactions that are available on this subpage

  return (
    <div>
      t("section.title") // downloading translation
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ctx => {
  const translationsProps = await getTranslationsProps(ctx, ["common"]); // add here all transactions in string[] that you use on this subpage

  return {
    props: {
      ...translationsProps,
    },
  };
}

export { getStaticPaths }; // IMPORTANT ADD THIS LINE TO ENABLE MULTI ROUTING

export default Home;

```

**useTranslation - all functions**

```bash
const { t, tString, tNumber, tArray, tObject, pageTranslations } = useTranslation("common"); // enter the given namespace that you use in the given section

pageTranslations // all transactions that are available on this subpage

t("section.text1"); // if there is a translation, it returns it as any, if not, it returns undefined

tString("section.text2"); // if there is a translation and it has a string type, it returns it as string, if it doesn't find it, or it has the wrong type, it returns undefined.

tNumber("section.text3"); // if there is a translation and it has a number type, it returns it as number, if it doesn't find it, or it has the wrong type, it returns undefined.

tArray("section.text4"); // if there is a translation and it has a any[] type, it returns it as any[], if it doesn't find it, or it has the wrong type, it returns undefined.

tObject("section.text5"); // if there is a translation and it has a object type, it returns it as object, if it doesn't find it, or it has the wrong type, it returns undefined.


//if there is a translation and it has type string, if it doesn't find it or it has wrong type it returns undefined. If it contains <TComponent>value</TComponent> or <TComponent/>, you can create your own component based on the values returned from the callback
tComponent(
  "section.textLink",
  ({ textBefore, textComponent, textAfter }) => { // value from callback to create your own component
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

**package.json**

You need to install these packages to be able to download your translations from the api:

- fs-extra (https://www.npmjs.com/package/fs-extra)
- node-fetch (https://www.npmjs.com/package/node-fetch)

```bash
"scripts": {
    "getTranslations": "node node_modules/next-translations/getTranslations.mjs", // script to fetch all translations from your api **linkFetchTranslations**
    "dev": "npm run getTranslations && next dev",
    "build": "npm run getTranslations && next build",
}
```
