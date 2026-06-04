import Head from 'expo-router/head';

import { adsenseSiteVerification, siteUrl } from '@/lib/env';

const defaultOgImage =
  'https://images.unsplash.com/photo-1635363638580-c2809d049eee?auto=format&fit=crop&w=1200&q=80';

type SeoHeadProps = {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
};

function absoluteUrl(path: string): string {
  const normalizedBase = siteUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function SeoHead({
  title,
  description,
  path,
  imageUrl,
  type = 'website',
  noIndex = false,
}: SeoHeadProps) {
  const canonicalUrl = absoluteUrl(path);
  const ogImage = imageUrl ?? defaultOgImage;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="K-Food Travel" />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {adsenseSiteVerification ? <meta name="google-adsense-account" content={adsenseSiteVerification} /> : null}
    </Head>
  );
}
