import ProductDetailClient from './ProductDetailClient';

interface ProductDetailProps {
  params?: Promise<{
    id?: string;
  }>;
}

export default function ProductDetail({ params }: ProductDetailProps) {
  return <ProductDetailClient params={params} />;
}
