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
  siteTitle: 'LUCKEY Running',
  siteUrl: 'https://chendaqian.github.io/sport-records/',
  logo: 'https://chendaqian.github.io/images/favicon.png',
  description: 'run run run',
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
