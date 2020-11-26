declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const query: DocumentNode;

  export { query };

  export default defaultDocument;
}

declare module '*.graphql' {
  const schema: any;
  export default schema;
}
