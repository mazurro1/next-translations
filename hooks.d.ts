declare const fse: any;
declare const path: any;
declare const exists: any;
type TranslationsConfigType = {
    componentNameToReplaced?: string;
};
declare let translationsConfigUser: TranslationsConfigType | undefined;
declare const translationsConfig: {
    componentNameToReplaced: string;
};
type IPageTranslationsType = {
    [key: string]: any;
};
type IType = "string" | "number" | "array" | "object" | "any";
type ICallbackType = {
    textBefore: string | undefined;
    textComponent: string | undefined;
    textAfter: string | undefined;
};
declare let pageTranslations: IPageTranslationsType | null;
declare const resolvePath: (object: any, path: string, defaultValue?: any) => any;
declare const initializeTranslations: (translations: IPageTranslationsType) => void;
declare const checkTypesAndReturn: (type: IType, value: any) => any;
declare const generateTranslationWithType: (slug: string, translationsNamespace: IPageTranslationsType | undefined, namespace: string, type: IType) => any;
declare const useTranslation: (namespace: string) => {
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
