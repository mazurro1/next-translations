declare module "hooks" {
    type IPageTranslationsType = {
        [key: string]: any;
    };
    type ICallbackType = {
        textBefore: string | undefined;
        textComponent: string | undefined;
        textAfter: string | undefined;
    };
    let pageTranslations: IPageTranslationsType | null;
    const initializeTranslations: (translations: IPageTranslationsType) => void;
    const useTranslation: (namespace: string) => {
        t: (slug: string) => any;
        tString: (slug: string) => any;
        tNumber: (slug: string) => any;
        tArray: (slug: string) => any;
        tObject: (slug: string) => any;
        tComponent: (slug: string, callback: ({}: ICallbackType) => any) => any;
        pageTranslations?: undefined;
    } | {
        t: (slug?: string) => any;
        tString: (slug?: string) => string | undefined;
        tNumber: (slug?: string) => number | undefined;
        tArray: (slug?: string) => any[] | undefined;
        tObject: (slug?: string) => object | undefined;
        tComponent: (slug: string, callback: ({}: ICallbackType) => any) => any;
        pageTranslations: IPageTranslationsType;
    };
    export { initializeTranslations, pageTranslations, useTranslation };
}
