import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: { default: "TDM 155AI week 5", template: "%s · TDM 155AI week 5" },
  description: "The week 5 (Research) workbook: docs, working context, and dictation.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#121412",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
