type IPageTranslationsType = {
    [key: string]: any;
};
declare let pageTranslations: IPageTranslationsType | null;
declare const initializeTranslations: (translations: IPageTranslationsType) => void;
declare const useTranslation: (namespace: string) => {
    t: (slug: string) => string;
    pageTranslations?: undefined;
} | {
    t: (slug?: string) => any;
    pageTranslations: IPageTranslationsType;
};
