export interface StoreImage {
  id: string;
  event: string;
  description?: string;
  image: Array<{ alt: string; image: string }>;
  startDate: string;
  endDate: string;

  createdAt: string;
  updatedAt: string;
}
