export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/s/", "/success", "/api/"] }],
    sitemap: "https://said.nyttolabs.com/sitemap.xml"
  };
}
