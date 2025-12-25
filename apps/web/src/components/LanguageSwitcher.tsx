import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
    // Ngôn ngữ sẽ tự lưu vào localStorage nhờ detector
  };

  const currentLang = i18n.language.startsWith("vi") ? "vi" : "en";

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage("en")} style={{ fontWeight: currentLang === "en" ? "bold" : "normal" }}>
        English
      </button>
      {" | "}
      <button onClick={() => changeLanguage("vi")} style={{ fontWeight: currentLang === "vi" ? "bold" : "normal" }}>
        Tiếng Việt
      </button>
    </div>
  );
}
