type ITranslatesPageType = {
    [key: string]: any;
};
declare let translatesPage: ITranslatesPageType | null;
declare const initializeTranslates: (translates: ITranslatesPageType) => void;
declare const useTranslation: (namespace: string) => {
    t: (slug: any) => string;
    translatesPage?: undefined;
} | {
    t: (slug?: string) => string | ITranslatesPageType;
    translatesPage: ITranslatesPageType;
};
