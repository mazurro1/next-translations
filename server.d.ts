export type T_PageTranslations = {
    [key: string]: any;
};
export declare function getTranslationsPropsServer(ctx: any, ns?: string[]): Promise<{
    translations?: T_PageTranslations | undefined;
}>;
