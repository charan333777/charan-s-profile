import { CONTACT } from './data';

/**
 * Builds a vCard 3.0 string for "save to contacts". `baseUrl` is the resolved
 * absolute origin so the photo + connect-page links point at the deployed site
 * (matches the QR's URL resolution). Values avoid unescaped commas/semicolons
 * so the card imports cleanly across iOS and Android.
 */
export function buildVCard(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Duduka;Saicharan;;;',
    'FN:Saicharan Duduka',
    'NICKNAME:Charan',
    'TITLE:DevOps & Cloud Engineer and Founder',
    `EMAIL;TYPE=INTERNET:${CONTACT.email}`,
    `URL:${base}/connect`,
    `item1.URL:${CONTACT.linkedin.href}`,
    'item1.X-ABLabel:LinkedIn',
    `item2.URL:${CONTACT.github.href}`,
    'item2.X-ABLabel:GitHub',
    `item3.URL:${CONTACT.instagram.href}`,
    'item3.X-ABLabel:Instagram',
    'ADR;TYPE=HOME:;;;Thames Valley;;;United Kingdom',
    `PHOTO;VALUE=URI:${base}/photos/charan-portrait.jpg`,
    'NOTE:Founder and builder. A quick hello from the Thames Valley.',
    'END:VCARD',
  ];
  return lines.join('\r\n');
}
