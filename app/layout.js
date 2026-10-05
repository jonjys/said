export const metadata = {
  title: "Said — seal one line",
  description: "Write one sentence. Pay €2. Get a public page that proves you said it, and when.",
  openGraph: { title: "Said", description: "One sentence. Two euros. A public page.", url: "https://said-jonjys.vercel.app" }
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
