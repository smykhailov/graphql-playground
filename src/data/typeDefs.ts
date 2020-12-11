const typeDefs = `
type Query {
  feeds: [Feed]
  feedStream: [Feed]
  feedStreamEmbedded: FeedStreamEmbedded
  articles: [Article]
}

type Article {
  id: ID
  title: String
  author: String
}

type Feed {
  id: ID
  title: String
  description: String
}

type FeedStreamEmbedded {
  feedStream: [Feed]
  hasNextPage: Boolean
}

`;

export default typeDefs;
