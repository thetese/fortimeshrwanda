import { headerHtml, footerHtml, buildSchema } from '../lib/site-data';
import ClientInteractions from './ClientInteractions';

export default function PageShell({
  active = '',
  pathName = '/',
  image = 'hero-kigali',
  crumbs,
  product,
  includeFaq = false,
  bodyHtml = '',
}) {
  const schemaObj = buildSchema({ pathName, image, crumbs, product, includeFaq });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObj) }}
      />
      <div dangerouslySetInnerHTML={{ __html: headerHtml(active) }} />
      <main id="main" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
      <ClientInteractions />
    </>
  );
}
