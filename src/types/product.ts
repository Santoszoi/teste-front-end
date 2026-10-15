export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  previousPrice?: number;
  description: string;
  category?: string;
  installments?: string;
};
