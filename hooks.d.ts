type IpageTranslationsType = {
  [key: string]: any;
};
declare let pageTranslations: IpageTranslationsType | null;
declare const initializeTranslations: (
  translations: IpageTranslationsType
) => void;
declare const useTranslation: (namespace: string) =>
  | {
      t: (slug: any) => string;
      pageTranslations?: undefined;
    }
  | {
      t: (slug?: string) => string | IpageTranslationsType;
      pageTranslations: IpageTranslationsType;
    };
