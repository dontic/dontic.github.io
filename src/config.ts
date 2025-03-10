type SiteConfig = {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  logo?: string;
  header: {
    links: { href: string; text: string }[];
  };
  footer: {
    showRSS: boolean;
  };
  ogImage: string;
  locale: string;
  twitter: {
    site: string;
  };
};

export const SITE: SiteConfig = {
  title: 'Daniel García',
  description: 'Personal Blog',
  author: 'Daniel García',
  siteUrl: 'https://daniel.es',
  header: {
    links: [
      { href: '/blog/', text: 'Blog' },
      { href: '/projects/', text: 'Projects' },
      { href: '/about/', text: 'About me' },
    ],
  },
  footer: {
    showRSS: true,
  },
  ogImage: '~/assets/images/og_image.png',
  locale: 'en_US',
  twitter: {
    site: '@onticdani',
  },
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
