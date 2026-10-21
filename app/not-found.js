import PageShell from '../components/PageShell';
import { buildMetadata, notFoundHtml } from '../lib/site-data';

export const metadata = buildMetadata({
  title: 'Page Not Found',
  description:
    'The page you requested could not be found. Explore the FORTIMESH AND STEELS RWANDA LTD product catalogue or contact our Kigali sales desk.',
  pathName: '/404.html',
  image: 'beam',
});

export default function NotFoundPage() {
  return (
    <PageShell
      active=""
      pathName="/404.html"
      image="beam"
      bodyHtml={notFoundHtml}
    />
  );
}
