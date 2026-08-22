import { SITE } from '../constants/site';

const STATIC_PATHS = ['', '/portfolio', '/background', '/contact'];

function generateSitemap() {
  const urls = STATIC_PATHS.map((path) => {
    return `  <url>
    <loc>${SITE.url}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml');
  res.write(generateSitemap());
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
