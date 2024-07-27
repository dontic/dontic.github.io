import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://daniel.es/", // replace this with your deployed domain
  author: "Daniel Garcia",
  desc: "Welcome to my personal website. I write about web development, tech and business stuff.",
  title: "Daniel's Internet Home",
  ogImage: "og-image.jpg",
  lightAndDarkMode: true,
  postPerPage: 8,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: true,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "X",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on X`,
    active: true,
  },
  {
    name: "Github",
    href: "https://github.com/dontic",
    linkTitle: `Daniel on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Facebook`,
    active: false,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/gsdaniel/",
    linkTitle: `Daniel on LinkedIn`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/onticdani",
    linkTitle: `Daniel on Instagram`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to Daniel`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Twitter`,
    active: false,
  },
  {
    name: "Twitch",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on YouTube`,
    active: false,
  },
  {
    name: "WhatsApp",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Discord`,
    active: false,
  },
  {
    name: "GitLab",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Telegram`,
    active: false,
  },
  {
    name: "Mastodon",
    href: "https://x.com/onticdani",
    linkTitle: `Daniel on Mastodon`,
    active: false,
  },
];
