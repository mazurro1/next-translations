type IPageTranslationsType = {
    [key: string]: any;
};
type IType = "string" | "number" | "array" | "object" | "any";
declare let pageTranslations: IPageTranslationsType | null;
declare const initializeTranslations: (translations: IPageTranslationsType) => void;
declare const checkTypesAndReturn: (type: IType, value: any) => any;
declare const generateTranslationWithType: (slug: string, translationsNamespace: IPageTranslationsType | undefined, namespace: string, type: IType) => any;
declare const useTranslation: (namespace: string) => {
    t: (slug: string) => any;
    tString: (slug: string) => any;
    tNumber: (slug: string) => any;
    tArray: (slug: string) => any;
    tObject: (slug: string) => any;
    pageTranslations?: undefined;
} | {
    t: (slug?: string) => any;
    tString: (slug?: string) => string | undefined;
    tNumber: (slug?: string) => number | undefined;
    tArray: (slug?: string) => any[] | undefined;
    tObject: (slug?: string) => object | undefined;
    pageTranslations: IPageTranslationsType;
};
