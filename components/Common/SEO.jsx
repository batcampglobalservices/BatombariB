import Head from 'next/head';
import { SITE } from '../../constants/site';

const SEO = ({
  title,
  description = SITE.description,
  path = '',
  image = SITE.defaultOgImage,
  noindex = false,
  jsonLd,
}) => {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.title;
  const canonicalUrl = `${SITE.url}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE.url}${image}`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={SITE.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      {SITE.twitterHandle && <meta name="twitter:site" content={SITE.twitterHandle} />}

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  );
};

export default SEO;
