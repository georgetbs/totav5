export interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  imageUrl?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  language: string;
}

export interface NewsState {
  items: NewsItem[];
  isLoading: boolean;
  error: string | null;
}

