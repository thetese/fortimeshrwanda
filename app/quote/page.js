import PageShell from '../../components/PageShell';
import { buildMetadata, quoteHtml } from '../../lib/site-data';

export const metadata = buildMetadata({
  title: 'Request a Material Quote & BoQ Schedule',
  description:
    'Prepare an itemised material schedule or BoQ request for gabion mesh, rebar, structural steel, plumbing and electrical supplies from FORTIMESH AND STEELS RWANDA LTD in Kigali.',
  pathName: '/quote/',
  image: 'wire',
});

export default function QuotePage() {
  return (
    <PageShell
      active="quote"
      pathName="/quote/"
      image="wire"
      crumbs={[
        ['Home', '/'],
        ['Request a quote', '/quote/'],
      ]}
      includeFaq
      bodyHtml={quoteHtml}
    />
  );
}
