/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query mainQuery {
      stories: allStoryblokEntry(filter: { field_component: { eq: "page" } }) {
        edges {
          node {
            id
            full_slug
            lang
            uuid
          }
        }
      }
      homePages: allStoryblokEntry(filter: { name: { eq: "Home" } }) {
        edges {
          node {
            id
            full_slug
            lang
            uuid
          }
        }
      }
    }
  `)

  const pageTemplate = path.resolve(`./src/templates/page-template.js`)

  result.data.stories.edges
    .filter(({ node }) => node.full_slug !== "/")
    .map(({ node }) => {
      createPage({
        path: node.full_slug,
        component: pageTemplate,
        context: {
          nodeId: node.id,
          uuid: node.uuid,
        },
      })
    })

  result.data.homePages.edges.map(({ node }) => {
    createPage({
      path: node.lang != "default" ? node.lang : "en",
      component: pageTemplate,
      context: {
        nodeId: node.id,
        uuid: node.uuid,
      },
    })
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MenuItem {
      name: String!
      full_slug: String!
    }

    type MenuData implements Node {
      lang: String!
      pageIds: [String]!
      menuItems: [MenuItem]!
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({
  node,
  createNodeId,
  createContentDigest,
  actions,
}) => {
  const { createNode } = actions

  if (node.field_component === "menu") {
    const nodeData = {
      key: node.id,
      lang: node.lang,
      pageIds: JSON.parse(node.content).items.map(item => item.page),
    }
    const nodeContent = JSON.stringify(nodeData)
    const nodeMeta = {
      id: createNodeId(`menu-data-${nodeData.key}`),
      parent: null,
      children: [],
      internal: {
        type: "MenuData",
        mediaType: "text/html",
        content: nodeContent,
        contentDigest: createContentDigest(nodeData),
      },
    }
    createNode(Object.assign({}, nodeData, nodeMeta))
  }
}

const resolveMenuItems = (source, context) => {
  return source.pageIds.map(pageId =>
    context.nodeModel
      .runQuery({
        query: {
          filter: {
            uuid: {
              eq: pageId,
            },
            lang: {
              eq: source.lang,
            },
          },
        },
        type: "StoryblokEntry",
        firstOnly: true,
      })
      .then(pageNode => {
        return {
          name: pageNode.name,
          full_slug: pageNode.full_slug,
        }
      })
  )
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MenuData: {
      menuItems: {
        resolve: (source, args, context, info) => {
          return resolveMenuItems(source, context)
        },
      },
    },
  }
  createResolvers(resolvers)
}
