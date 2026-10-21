import { site } from '../lib/site-data';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site.origin}/sitemap.xml`,
  };
}
