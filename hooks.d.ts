import { PropsWithChildren } from "react";
type TPageTranslations = {
    [key: string]: any;
};
type TCallback = {
    textBefore: string | undefined;
    textComponent: string | undefined;
    textAfter: string | undefined;
};
type TInitializeTranslations = {
    translations: TPageTranslations;
    isLoggedUser?: boolean;
};
declare let pageTranslations: TPageTranslations | null;
declare const InitializeTranslations: ({ translations, isLoggedUser, }: PropsWithChildren<TInitializeTranslations>) => void;
declare const useTranslation: (namespace: string) => {
    t: (slug: string) => undefined;
    tString: (slug: string) => undefined;
    tNumber: (slug: string) => undefined;
    tArray: (slug: string) => undefined;
    tObject: (slug: string) => undefined;
    tComponent: (slug: string, callback: ({}: TCallback) => any) => any;
    pageTranslations?: undefined;
} | {
    t: (slug?: string) => any;
    tString: (slug?: string) => string | undefined;
    tNumber: (slug?: string) => number | undefined;
    tArray: (slug?: string) => any[] | undefined;
    tObject: (slug?: string) => object | undefined;
    tComponent: (slug: string | undefined, callback: ({}: TCallback) => any) => any;
    pageTranslations: TPageTranslations;
};
export { InitializeTranslations, pageTranslations, useTranslation };
