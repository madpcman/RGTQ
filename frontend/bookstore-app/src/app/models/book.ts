
export interface Book {
    id: number;
    title: string;
    author: string;
    detail: BookDetail;
  }

export interface BookDetail {
    publisher: string;
    publishedDate: Date;
    description?: string;
    sellCount: number;
    stockCount: number;
  }