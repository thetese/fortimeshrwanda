import { notFound } from 'next/navigation';
import PageShell from '../../../components/PageShell';
import { products, bySlug, buildMetadata, productPageHtml } from '../../../lib/site-data';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = bySlug[slug];
  if (!p) {
    return buildMetadata({
      title: 'Page Not Found',
      description: 'Requested product page not found.',
      pathName: '/404.html',
    });
  }
  return buildMetadata({
    title: `${p.name} in Kigali, Rwanda`,
    description: `${p.summary} Supplied by FORTIMESH AND STEELS RWANDA LTD from Kimironko, Kigali.`,
    pathName: `/products/${p.slug}/`,
    image: p.image,
    product: p,
  });
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const idx = products.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const p = products[idx];

  return (
    <PageShell
      active="products"
      pathName={`/products/${p.slug}/`}
      image={p.image}
      crumbs={[
        ['Home', '/'],
        ['Products', '/products/'],
        [p.name, `/products/${p.slug}/`],
      ]}
      product={p}
      bodyHtml={productPageHtml(p, idx)}
    />
  );
}
