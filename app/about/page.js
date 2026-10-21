import PageShell from '../../components/PageShell';
import { buildMetadata, aboutHtml } from '../../lib/site-data';

export const metadata = buildMetadata({
  title: 'About FORTIMESH AND STEELS RWANDA LTD',
  description:
    'Learn about FORTIMESH AND STEELS RWANDA LTD, a Kimironko, Kigali supplier of gabion mesh, reinforcement rebar, structural steel and construction materials serving projects across Rwanda.',
  pathName: '/about/',
  image: 'beam',
});

export default function AboutPage() {
  return (
    <PageShell
      active="about"
      pathName="/about/"
      image="beam"
      crumbs={[
        ['Home', '/'],
        ['About', '/about/'],
      ]}
      bodyHtml={aboutHtml}
    />
  );
}
