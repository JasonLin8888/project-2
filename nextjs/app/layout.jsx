import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "./globals.css";

export const metadata = {
  title: { default: "Project 2", template: "%s · Project 2" },
  description: "Project 2 for TDM 155AI: the finished video, with its brainstorming, inspiration, process, and reflection.",
};

export const viewport = {
  colorScheme: "light",
  themeColor: "#f7f3ea",
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
