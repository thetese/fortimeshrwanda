import PageShell from '../../components/PageShell';
import { buildMetadata, catalogHtml } from '../../lib/site-data';

export const metadata = buildMetadata({
  title: 'Products & Steel Supply Catalogue',
  description:
    'Browse the FORTIMESH AND STEELS RWANDA LTD product catalogue: gabion mesh, steel wire, deformed reinforcement steel, structural steel, plumbing, electrical and construction essentials in Kigali.',
  pathName: '/products/',
  image: 'steel-yard',
});

export default function ProductsPage() {
  return (
    <PageShell
      active="products"
      pathName="/products/"
      image="steel-yard"
      crumbs={[
        ['Home', '/'],
        ['Products', '/products/'],
      ]}
      bodyHtml={catalogHtml}
    />
  );
}
