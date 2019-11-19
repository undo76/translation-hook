import * as React from "react";
import { render } from "react-dom";

import "./styles.css";
import {
  TranslateFn,
  WithTranslation,
  useTranslation,
  IsoLanguage,
  T
} from "./Language";

// Example
interface MyAppProps {
  translate: TranslateFn;
}
function MyApp({ translate }: MyAppProps) {
  return (
    <WithTranslation translate={translate} defaultLanguage="en">
      <div className="App">
        <MyLanguageSelector />
        <MyPage />
        <MyLanguageSelector />
      </div>
    </WithTranslation>
  );
}

function MyLanguageSelector() {
  const [t, lang, setLanguage] = useTranslation();
  const handleLanguageChange = React.useCallback(
    e => setLanguage(e.target.value as IsoLanguage),
    [setLanguage]
  );
  return (
    <menu>
      <select value={lang} onChange={handleLanguageChange}>
        <option value="es">Español</option>
        <option value="en">English</option>
      </select>
      <p>
        {t("app.currLang")} <b>{lang}</b>
      </p>
    </menu>
  );
}

function MyPage() {
  return (
    <>
      <MyTitle>app.title</MyTitle>
      <MyBody>app.body</MyBody>
      <T msg="app.other" />
    </>
  );
}

// Using custom hook directly
function MyTitle({ children }: { children: string }) {
  const [t] = useTranslation();
  return <h1>{t(children)}</h1>;
}

//Using T wrapper component
function MyBody({ children }: { children: string }) {
  return (
    <p>
      <T msg={children} />
    </p>
  );
}

const translations = {
  es: {
    "app.title": "Bienvenido!",
    "app.body": "Y aqui va el contenido",
    "app.other": "Otro",
    "app.currLang": "El lenguaje seleccionado es: "
  },
  en: {
    "app.title": "Welcome!",
    "app.body": "Here we go",
    "app.other": "Another",
    "app.currLang": "The current language is: "
  }
};

// A simple implementation of translateFn
const myTranslate: TranslateFn = lang => msg =>
  translations[lang][msg] || `??? ${msg} ???`;

const rootElement = document.getElementById("root");
render(<MyApp translate={myTranslate} />, rootElement);
