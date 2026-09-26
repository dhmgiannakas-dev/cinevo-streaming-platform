import { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();



function SettingsProvider({ children }) {

  const [autoplayTrailers, setAutoplayTrailers] = useState(() => {
  const saved = localStorage.getItem("cinevo-autoplay-trailers");

  return saved !== null ? JSON.parse(saved) : true;
});

const [reducedMotion, setReducedMotion] = useState(() => {
  const saved = localStorage.getItem("cinevo-reduced-motion");

  return saved !== null ? JSON.parse(saved) : false;
});

const [showMatureContent, setShowMatureContent] = useState(() => {
  const saved = localStorage.getItem("cinevo-mature-content");

  return saved !== null ? JSON.parse(saved) : false;
});


  useEffect(() => {
  localStorage.setItem(
    "cinevo-autoplay-trailers",
    JSON.stringify(autoplayTrailers)
  );
}, [autoplayTrailers]);

useEffect(() => {
  localStorage.setItem(
    "cinevo-reduced-motion",
    JSON.stringify(reducedMotion)
  );
}, [reducedMotion]);

useEffect(() => {
  localStorage.setItem(
    "cinevo-mature-content",
    JSON.stringify(showMatureContent)
  );
}, [showMatureContent]);

  return (
    <SettingsContext.Provider
      value={{
        autoplayTrailers,
        setAutoplayTrailers,
        reducedMotion,
        setReducedMotion,
        showMatureContent,
        setShowMatureContent,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;