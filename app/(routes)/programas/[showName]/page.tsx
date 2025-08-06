import ProgramDetail from '@/src/components/features/Programa'

interface ProgramPageProps {
  params: Promise<{
    showName: string
  }>
}

export default async function ProgramaDetalle({ params }: ProgramPageProps) {
  const resolvedParams = await params;
  return <ProgramDetail params={Promise.resolve(resolvedParams)} />
} 