type IPageTranslationsType = {
    [key: string]: any;
};
type IType = "string" | "number" | "array" | "object";
type ITPropsType = {
    slug: string;
    type?: IType;
} | string;
declare let pageTranslations: IPageTranslationsType | null;
declare const initializeTranslations: (translations: IPageTranslationsType) => void;
declare const checkTypesAndReturn: (type: IType, value: any) => string | number | Object | any[] | undefined;
declare const useTranslation: (namespace: string) => {
    t: (slug: string) => string;
    pageTranslations?: undefined;
} | {
    t: (props?: ITPropsType) => string | number | Object;
    pageTranslations: IPageTranslationsType;
};
