import DetallePrograma from './PaginaPrograma'
import configPrograma, { ProgramConfig } from './ConfigProgramas'
import { notFound } from 'next/navigation'

interface ProgramPageProps {
  params: Promise<{
    showName: string
  }>
}

export default async function ProgramaPage({ params }: ProgramPageProps) {
  // Resolve params on the server
  const { showName } = await params
  
  // Get program configuration
  const programConfig: ProgramConfig | undefined = configPrograma[showName]
  
  // If program doesn't exist, show 404
  if (!programConfig) {
    notFound()
  }
  
  return <DetallePrograma programConfig={programConfig} />
} 