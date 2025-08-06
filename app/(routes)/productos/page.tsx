import { Suspense } from 'react'
import ProductosPage from '@/src/pages/Productos'

export default function Productos() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductosPage />
    </Suspense>
  )
} 