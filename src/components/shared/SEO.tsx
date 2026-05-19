import { Title, Meta, Link } from '@solidjs/meta';
import { mergeProps } from 'solid-js';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Simako';
const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:3000';
const DEFAULT_DESC =
  'Simako — cari kost dekat kampus di Purwokerto, transfer manual, verifikasi human-checked.';
const DEFAULT_IMAGE = `${APP_URL}/og-image.png`;

export function SEO(rawProps: SEOProps) {
  const props = mergeProps(
    {
      title: APP_NAME,
      description: DEFAULT_DESC,
      image: DEFAULT_IMAGE,
      url: APP_URL,
      noIndex: false,
      type: 'website' as const,
    },
    rawProps,
  );

  const fullTitle = () =>
    props.title === APP_NAME ? APP_NAME : `${props.title} — ${APP_NAME}`;

  return (
    <>
      <Title>{fullTitle()}</Title>
      <Meta name="description" content={props.description} />
      <Meta name="robots" content={props.noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <Link rel="canonical" href={props.url} />

      {/* Open Graph */}
      <Meta property="og:type" content={props.type} />
      <Meta property="og:title" content={fullTitle()} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:image" content={props.image} />
      <Meta property="og:url" content={props.url} />
      <Meta property="og:site_name" content={APP_NAME} />

      {/* Twitter Card */}
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={fullTitle()} />
      <Meta name="twitter:description" content={props.description} />
      <Meta name="twitter:image" content={props.image} />
    </>
  );
}
