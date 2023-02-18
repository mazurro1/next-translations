declare const allTranslationsLanguages: any;
declare function getTranslationsProps(ctx: any, ns?: string[]): Promise<{
    translations?: {} | undefined;
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
export { allTranslationsLanguages, getTranslationsProps, getPaths, getStaticPaths, };
