const typeDefs = `
interface Node {
  id: ID!
}

interface Edge {
  cursor: String!
  node: Node
}

type PageInfo {
  startCursor: String
  endCursor: String
  hasNextPage: Boolean!
}

interface Connection {
  pageInfo: PageInfo!
  edges: [Edge]
}

type FeedNode implements Node {
  id: ID!
  title: String
  description: String
}

type FeedEdge implements Edge {
  node: FeedNode
  cursor: String!
}

type Feeds implements Connection {
  edges: [FeedEdge]
  pageInfo: PageInfo!
}

type FeedsStream implements Connection {
  edges: [FeedEdge]
  pageInfo: PageInfo!
}

type ArticleNode implements Node {
  id: ID!
  title: String
  author: String
}

type Query {
  feeds: Feeds
  feedsStream(first: Int, after: String): FeedsStream
  articles(first: Int!): [ArticleNode]
  articlesLazy: [ArticleNode]
}
`;

export default typeDefs;
