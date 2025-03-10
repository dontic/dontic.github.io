type site = {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  logo?: string;
};

export const site: site = {
  title: 'Daniel García',
  description: 'Personal Blog',
  author: 'Daniel García',
  siteUrl: 'https://daniel.es',
};

export const navigation = {
  header: {
    links: [
      { href: '/tech', text: 'Tech' },
      { href: '/business', text: 'Business' },
      { href: '/projects', text: 'Projects' },
    ],
  },
  footer: {
    title: 'My App',
    description: 'My App Description',
    keywords: 'my, app, keywords',
  },
};

export const socialLinks = [
  { name: 'X', url: 'https://x.com/onticdani' },
  { name: 'GitHub', url: 'https://github.com/dontic' },
];
