import PageShell from '../../components/PageShell';
import { buildMetadata, applicationsHtml } from '../../lib/site-data';

export const metadata = buildMetadata({
  title: 'Construction & Civil Engineering Applications',
  description:
    'See how FORTIMESH AND STEELS RWANDA LTD supplies hillside gabion retaining walls, reinforced concrete structures, MEP installations and waterproofing across Rwanda.',
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
