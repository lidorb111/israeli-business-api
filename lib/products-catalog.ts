export type Product = {
  day: number;
  slug: string;
  name: string;
  oneLiner: string;
  status: 'live' | 'coming-soon';
  category: string;
  demoUrl?: string;
  rapidApiUrl: string;
  apifyUrl?: string;
  priceLabel: string;
  audience: string;
  valuePoints: string[];
};

export const products: Product[] = [
  {
    day: 1,
    slug: 'company-checker',
    name: 'Company Checker',
    oneLiner: 'Search and validate Israeli companies in seconds.',
    status: 'live',
    category: 'Business Data',
    demoUrl: '/demo.html',
    rapidApiUrl: 'https://rapidapi.com/team/behar-system-behar-system-default',
    apifyUrl: 'https://apify.com/behar.system/israeli-business-lookup',
    priceLabel: 'Free + Paid plans',
    audience: 'Developers, fintech products, compliance teams',
    valuePoints: [
      'Search across official registries',
      'Validate company IDs quickly',
      'Risk score and enrichment in one flow',
    ],
  },
  {
    day: 2,
    slug: 'day-2-coming-soon',
    name: 'Day 2 Product',
    oneLiner: 'A focused API tool that solves one clear problem.',
    status: 'coming-soon',
    category: 'Coming Soon',
    rapidApiUrl: 'https://rapidapi.com/team/behar-system-behar-system-default',
    priceLabel: 'TBD',
    audience: 'TBD',
    valuePoints: ['Launching tomorrow'],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
