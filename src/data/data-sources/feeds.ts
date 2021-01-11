import faker from 'faker';
import { IFeedNode } from 'components/feeds/feeds-stream-list';

export const FEEDS_COUNT = 10;

export function getFeeds(first: number, after?: string) {
  const articles: IFeedNode[] = [];
  const firstIndex = after ? parseInt(after, 10) + 1 : 0;

  for (let i = 1; i <= first; i++) {
    articles.push({
      id: (firstIndex + i).toString(),
      title: faker.random.words(5),
      description: faker.random.words(25),
    });
  }

  return articles;
}
