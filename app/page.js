import PageShell from '../components/PageShell';
import { buildMetadata, homeHtml } from '../lib/site-data';

export const metadata = buildMetadata({
  title: 'Structural Steel, Rebar, Wire Mesh & Construction Materials in Kigali, Rwanda',
  description:
    'FORTIMESH AND STEELS RWANDA LTD supplies structural steel beams, channels, hollow sections, steel plates, reinforcement rebar, chain-link fencing, galvanised pipes and construction materials from Gisozi, Kigali across Rwanda.',
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
