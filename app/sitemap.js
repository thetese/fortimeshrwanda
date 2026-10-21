import { site, products } from '../lib/site-data';

export default function sitemap() {
  const lastModified = new Date();
  const staticRoutes = [
    { url: `${site.origin}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${site.origin}/products/`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.origin}/applications/`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.origin}/about/`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.origin}/contact/`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.origin}/quote/`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const productRoutes = products.map((p) => ({
    url: `${site.origin}/products/${p.slug}/`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
