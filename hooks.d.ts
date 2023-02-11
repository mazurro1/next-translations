type ITranslationsPageType = {
  [key: string]: any;
};
declare let translationsPage: ITranslationsPageType | null;
declare const initializeTranslations: (
  translations: ITranslationsPageType
) => void;
declare const useTranslation: (namespace: string) =>
  | {
      t: (slug: any) => string;
      translationsPage?: undefined;
    }
  | {
      t: (slug?: string) => string | ITranslationsPageType;
      translationsPage: ITranslationsPageType;
    };
