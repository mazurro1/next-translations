declare const fse: any;
declare const path: any;
declare const exists: any;
type TranslationsConfigType = {
    defaultLocale?: string;
    locales?: string[];
    outputFolderTranslations?: string;
    componentNameToReplaced?: string;
    languageWithoutMultirouting?: string;
    constNamespaces?: string[];
};
declare let translationsConfigUser: TranslationsConfigType | undefined;
declare const translationsConfig: {
    defaultLocale: string;
    locales: string[];
    outputFolderTranslations: string;
    languageWithoutMultirouting: string;
    constNamespaces: string[];
};
declare const allTranslationsLanguages: string[];
declare const getTranslationsFromFiles: (locale?: string, ns?: string[]) => Promise<{
    translations: {};
}>;
declare function getTranslationsProps(ctx: any, ns?: string[]): Promise<{
    translations: {};
}>;
declare const getPaths: () => {
    params: {
        locale: string;
    };
}[];
declare const getStaticPaths: () => {
    fallback: boolean;
    paths: {
        params: {
            locale: string;
        };
    }[];
};
