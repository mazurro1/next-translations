declare const fse: any;
declare const path: any;
declare const translatesConfigUser: any;
declare const translatesConfig: {
    defaultLocale: any;
    locales: any;
    linkFetchTranslates: any;
    outputFolderTranslates: any;
    nameFolderMultirouting: any;
    languageWithoutMultirouting: any;
    constNamespaces: any;
    namespaces: any;
};
declare const allTranslatesLanguages: any;
declare const getTranslatesFromFiles: (locale?: string, ns?: string[]) => Promise<{
    translates: {};
}>;
declare function getTranslatesProps(ctx: any, ns?: string[]): Promise<{
    translates: {};
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
