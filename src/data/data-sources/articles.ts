import { IArticleNode } from '../../components/feeds/articles-list';
import faker from 'faker';

export const ARTICLES_COUNT = 20;

export function getArticles(first: number, after?: string) {
  const articles: IArticleNode[] = [];
  const firstIndex = after ? parseInt(after, 10) + 1 : 0;

  for (let i = 1; i <= first; i++) {
    articles.push({
      id: (firstIndex + i).toString(),
      title: faker.random.words(5),
      author: faker.random.words(2),
    });
  }

  return articles;
}
