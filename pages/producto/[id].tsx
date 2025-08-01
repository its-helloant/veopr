import { useRouter } from 'next/router'
import ProductDetail from '../../src/pages/ProductDetail'

export default function ProductoDetalle() {
  const router = useRouter()
  const { id } = router.query

  return <ProductDetail />
} 