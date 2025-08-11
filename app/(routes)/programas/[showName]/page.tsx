import DetallePrograma from './DetallePrograma'

interface ProgramPageProps {
  params: Promise<{
    showName: string
  }>
}

export default async function ProgramaDetalle({ params }: ProgramPageProps) {
  return <DetallePrograma params={params} />
} 