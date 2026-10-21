import PageShell from '../components/PageShell';
import { buildMetadata, homeHtml } from '../lib/site-data';

export const metadata = buildMetadata({
  title: 'Steel, Gabion Mesh & Construction Materials in Kigali, Rwanda',
  description:
    'FORTIMESH AND STEELS RWANDA LTD supplies gabion mesh, steel wire, reinforcement rebar, structural steel, plumbing, electrical and construction materials from Kimironko, Kigali across Rwanda.',
  pathName: '/',
  image: 'hero-kigali',
});

export default function HomePage() {
  return (
    <PageShell
      active="home"
      pathName="/"
      image="hero-kigali"
      includeFaq
      bodyHtml={homeHtml}
    />
  );
}
