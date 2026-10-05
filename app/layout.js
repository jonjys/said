export const metadata = {
  metadataBase: new URL("https://said.nyttolabs.com"),
  title: "Said — seal one line",
  description: "Write one sentence. Pay €2. Get a public page that proves you said it, and when.",
  alternates: { canonical: "/" },
  openGraph: { title: "Said", description: "One sentence. Two euros. A public page.", url: "https://said.nyttolabs.com" }
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
