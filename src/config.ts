type site = {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  logo?: string;
  showRSS?: boolean;
};

export const site: site = {
  title: 'Daniel García',
  description: 'Personal Blog',
  author: 'Daniel García',
  siteUrl: 'https://daniel.es',
  showRSS: true,
};

export const navigation = {
  header: {
    links: [
      { href: '/blog', text: 'Blog' },
      { href: '/projects', text: 'Projects' },
      { href: '/about', text: 'About me' },
    ],
  },
  footer: {},
};

export const socialLinks = [
  {
    name: 'GitHub',
    url: 'htps://github.com/dontic',
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: 'tabler:brand-github',
  },
  {
    name: 'X',
    url: 'https://x.com/onticdani',
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: 'tabler:brand-x',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/gsdaniel',
    target: '_blank',
    rel: 'noopener noreferrer',
    icon: 'tabler:brand-linkedin',
  },
];
