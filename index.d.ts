declare module "index" {
    const allTranslationsLanguages: any;
    function getTranslationsProps(ctx: any, ns?: string[]): Promise<{
        translations: {};
    }>;
    const getPaths: () => {
        params: {
            locale: string;
        };
    }[];
    const getStaticPaths: () => {
        fallback: boolean;
        paths: {
            params: {
                locale: string;
            };
        }[];
    };
    export { allTranslationsLanguages, getTranslationsProps, getPaths, getStaticPaths, };
}
