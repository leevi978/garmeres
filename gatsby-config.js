module.exports = {
  siteMetadata: {
    title: `Garmeres - Official website`,
    description: `Official website for Garmeres.`,
    author: `@leevi978`,
  },
  flags: {
    THE_FLAG: false,
    PARALLEL_SOURCING: false,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `garmeres`,
        short_name: `garmeres`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/ikon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-gatsby-cloud`,
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,

    {
      resolve: "gatsby-source-storyblok",
      options: {
        accessToken: "cqYfQpnpPi9yS2MBQADiQQtt",
        homeSlug: "home",
        version: "published", //process.env.NODE_ENV === "production" ? "published" : "draft",
        resolveLinks: "url",
        includeLinks: true,
      },
    },
    "gatsby-plugin-offline",
  ],
}
