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
  ogImage: '/src/assets/images/og-image.png', // Needs to be an absolute path /src/...
  locale: 'en_US',
  twitter: {
    site: '@onticdani',
  },
};

export const SITE_ES: SiteConfig = {
  title: 'Daniel García',
  description: 'Blog Personal',
  author: 'Daniel García',
  siteUrl: 'https://daniel.es',
  header: {
    links: [
      { href: '/es/blog/', text: 'Blog' },
      { href: '/es/projects/', text: 'Proyectos' },
      { href: '/es/about/', text: 'Sobre mí' },
    ],
  },
  footer: {
    showRSS: true,
  },
  ogImage: '/src/assets/images/og-image.png', // Needs to be an absolute path /src/...
  locale: 'es_ES',
  twitter: {
    site: '@onticdani',
  },
};

export const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/dontic',
    target: '_blank',
    // rel: 'noopener',
    icon: 'tabler:brand-github',
  },
  {
    name: 'X',
    url: 'https://x.com/onticdani',
    target: '_blank',
    // rel: 'noopener',
    icon: 'tabler:brand-x',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/gsdaniel',
    target: '_blank',
    // rel: 'noopener',
    icon: 'tabler:brand-linkedin',
  },
  {
    name: 'Mastodon',
    url: 'https://mastodon.social/@onticdani',
    target: '_blank',
    rel: 'me',
    icon: 'tabler:brand-mastodon',
  },
];
