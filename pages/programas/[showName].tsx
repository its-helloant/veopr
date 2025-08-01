import { useRouter } from 'next/router'
import ProgramDetail from '../../src/components/Programa'

export default function ProgramaDetalle() {
  const router = useRouter()
  const { showName } = router.query

  return <ProgramDetail />
} 