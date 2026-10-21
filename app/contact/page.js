import PageShell from '../../components/PageShell';
import { buildMetadata, contactHtml } from '../../lib/site-data';

export const metadata = buildMetadata({
  title: 'Contact & Kimironko Kigali Stockyard Location',
  description:
    'Contact FORTIMESH AND STEELS RWANDA LTD at KG 667 Street, Kimironko, Kigali. Call +250 793 086 644, chat on WhatsApp, or email fortimeshrwanda@gmail.com.',
  pathName: '/contact/',
  image: 'hero-kigali',
});

export default function ContactPage() {
  return (
    <PageShell
      active="contact"
      pathName="/contact/"
      image="hero-kigali"
      crumbs={[
        ['Home', '/'],
        ['Contact', '/contact/'],
      ]}
      includeFaq
      bodyHtml={contactHtml}
    />
  );
}
