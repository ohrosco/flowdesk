import "./globals.css";

export const metadata = {
  title: "FlowDesk — Lead Capture & Scheduling",
  description: "Automated lead follow-up and appointment scheduling for small businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
