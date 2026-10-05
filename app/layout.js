export const metadata = {
  metadataBase: new URL("https://said.nyttolabs.com"),
  title: "Said — försegla en mening",
  description: "Skriv en mening. Betala €2. Få en publik sida som visar att du sa det, och när.",
  alternates: { canonical: "/" },
  openGraph: { title: "Said", description: "En mening. Två euro. En publik sida.", url: "https://said.nyttolabs.com" }
};
export default function RootLayout({ children }) {
  return <html lang="sv"><body>{children}</body></html>;
}
