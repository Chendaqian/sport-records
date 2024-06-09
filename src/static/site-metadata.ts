interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const data: ISiteMetadataResult = {
  siteTitle: 'LUCKEY',
  siteUrl: 'https://chendaqian.github.io/sport-records/',
  logo: 'https://avatars.githubusercontent.com/u/9456449?v=4',
  description: 'LUCKEY Running',
  navLinks: [
    {
      name: 'Blog',
      url: 'https://www.cnblogs.com/Chendaqian',
    },
    {
      name: 'GithubIO',
      url: 'https://chendaqian.github.io/',
    },
    {
      name: 'Github',
      url: 'https://github.com/ChenDaqian',
    },
    {
      name: 'Strava',
      url: 'https://www.strava.com/athletes/119165768',
    },
    {
      name: 'About',
      url: 'https://github.com/Chendaqian',
    },
  ],
};

export default data;
