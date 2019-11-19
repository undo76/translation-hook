import * as React from "react";

export type IsoLanguage = "en" | "es" | "_inspect_"; //...
export type TranslateFn = (lang: IsoLanguage) => (msg: string) => string;
type TranslatorType = [
  (msg: string) => string,
  IsoLanguage,
  (lang: IsoLanguage) => void
];

// Initialize context
const TranslationContext: React.Context<TranslatorType> = React.createContext([
  msg => `??? ${msg} ???`,
  "_inspect_" as IsoLanguage,
  _ => {}
]);

// Custom hook that returns the translator function, the current language, and the language setter.
export function useTranslation(): TranslatorType {
  return React.useContext(TranslationContext);
}

// Translation component (Optional, if you don't want to use the useTranslation() hook directly)
interface TProps {
  msg: string;
}
export function T({ msg }: TProps) {
  const [t] = useTranslation();
  return <>{t(msg)}</>;
}

// Wrapper component to hide any context reference in the public API.
// It also keeps the state of the current language.
interface WithTranslationProps {
  translate: TranslateFn;
  defaultLanguage: IsoLanguage;
  children: React.ReactNode;
}
export function WithTranslation({
  translate,
  defaultLanguage,
  children
}: WithTranslationProps) {
  const [language, setLanguage] = React.useState(defaultLanguage);
  const contextValue = React.useMemo<TranslatorType>(
    () => [translate(language), language, setLanguage],
    [translate, language, setLanguage]
  );
  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}
