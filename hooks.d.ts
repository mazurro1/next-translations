type IPageTranslationsType = {
    [key: string]: any;
};
type ICallbackType = {
    textBefore: string | undefined;
    textComponent: string | undefined;
    textAfter: string | undefined;
};
declare let pageTranslations: IPageTranslationsType | null;
declare const initializeTranslations: (translations: IPageTranslationsType) => void;
declare const useTranslation: (namespace: string) => {
    t: (slug: string) => undefined;
    tString: (slug: string) => undefined;
    tNumber: (slug: string) => undefined;
    tArray: (slug: string) => undefined;
    tObject: (slug: string) => undefined;
    tComponent: (slug: string, callback: ({}: ICallbackType) => any) => any;
    pageTranslations?: undefined;
} | {
    t: (slug?: string) => any;
    tString: (slug?: string) => string | undefined;
    tNumber: (slug?: string) => number | undefined;
    tArray: (slug?: string) => any[] | undefined;
    tObject: (slug?: string) => object | undefined;
    tComponent: (slug: string | undefined, callback: ({}: ICallbackType) => any) => any;
    pageTranslations: IPageTranslationsType;
};
export { initializeTranslations, pageTranslations, useTranslation };
