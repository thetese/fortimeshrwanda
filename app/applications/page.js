import PageShell from '../../components/PageShell';
import { buildMetadata, applicationsHtml } from '../../lib/site-data';

export const metadata = buildMetadata({
  title: 'Construction & Structural Steel Applications',
  description:
    'See how FORTIMESH AND STEELS RWANDA LTD supplies structural steel frames, hollow sections, reinforced concrete structures, perimeter fencing, piping and waterproofing across Rwanda.',
  pathName: '/applications/',
  image: 'hero-site',
});

export default function ApplicationsPage() {
  return (
    <PageShell
      active="applications"
      pathName="/applications/"
      image="hero-site"
      crumbs={[
        ['Home', '/'],
        ['Applications', '/applications/'],
      ]}
      bodyHtml={applicationsHtml}
    />
  );
}
