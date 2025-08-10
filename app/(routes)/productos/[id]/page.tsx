import ProductDetail from './ProductDetail'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductoDetalle({ params }: ProductPageProps) {
  const resolvedParams = await params;
  return <ProductDetail params={Promise.resolve(resolvedParams)} />
} 