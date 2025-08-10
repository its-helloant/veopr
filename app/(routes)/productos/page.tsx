import { Suspense } from 'react'
import ProductosPage from './Productos'

export default function Productos() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductosPage />
    </Suspense>
  )
} 