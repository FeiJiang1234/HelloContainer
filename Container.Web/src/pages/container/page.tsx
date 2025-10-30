'use client'

import { ContainerDto } from '@/types'
import { useContainers, useModal } from '@/hooks'
import { ContainerCard, AddContainerForm, AddWaterModal, ConnectModal, LoadingSpinner, Toast } from '@/components'

export default function ContainersPage() {
  const { containers, loading, error, createContainer, deleteContainer, addWater, connectContainers, disconnectContainers } = useContainers()
  
  const addWaterModal = useModal<{ containerId: string; containerName: string }>()
  const connectModal = useModal<ContainerDto>()
  const toast = useModal<{ message: string; type: 'success' | 'error' }>()

  const handleCreate = async (data: any) => {
    const result = await createContainer(data)
    if (result.success) {
      toast.open({ message: 'Container created successfully!', type: 'success' })
    } else {
      toast.open({ message: result.error || 'Failed to create container', type: 'error' })
    }
  }

  const handleAddWater = async (containerId: string, amount: number) => {
    const result = await addWater(containerId, amount)
    if (result.success) {
      toast.open({ message: 'Water added successfully!', type: 'success' })
      addWaterModal.close()
    } else {
      toast.open({ message: result.error || 'Failed to add water', type: 'error' })
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteContainer(id)
    if (result.success) {
      toast.open({ message: 'Container deleted successfully!', type: 'success' })
    } else {
      toast.open({ message: result.error || 'Failed to delete container', type: 'error' })
    }
  }

  const handleConnect = async (sourceId: string, targetId: string) => {
    const result = await connectContainers(sourceId, targetId)
    if (result.success) {
      toast.open({ message: 'Containers connected successfully!', type: 'success' })
      connectModal.close()
    } else {
      toast.open({ message: result.error || 'Failed to connect containers', type: 'error' })
    }
  }

  const handleDisconnect = async (sourceId: string, targetId: string) => {
    const result = await disconnectContainers(sourceId, targetId)
    if (result.success) {
      toast.open({ message: 'Containers disconnected successfully!', type: 'success' })
    } else {
      toast.open({ message: result.error || 'Failed to disconnect containers', type: 'error' })
    }
  }

  const getAvailableContainers = (sourceContainer: ContainerDto): ContainerDto[] => {
    return containers.filter(c => 
      c.id !== sourceContainer.id && 
      !sourceContainer.connectedContainerIds.includes(c.id)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading containers..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Container Management</h1>

        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        <AddContainerForm onSubmit={handleCreate} />

        {containers.length > 0 ? (
          <div className="container-graph mt-8">
            {containers.map((container, index) => (
              <div key={container.id} style={{ position: 'absolute', left: `${index * 150 + 50}px` }}>
                <ContainerCard
                  container={container}
                  onAddWater={(id) => {
                    const container = containers.find(c => c.id === id)
                    addWaterModal.open({ containerId: id, containerName: container?.name || '' })
                  }}
                  onConnect={(id) => {
                    const container = containers.find(c => c.id === id)
                    if (container) connectModal.open(container)
                  }}
                  onDelete={handleDelete}
                  onDisconnect={handleDisconnect}
                  availableContainers={containers}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No containers found</h3>
            <p className="text-gray-600">Create your first container to get started.</p>
          </div>
        )}

        <AddWaterModal
          isOpen={addWaterModal.isOpen}
          containerName={addWaterModal.data?.containerName || ''}
          onClose={addWaterModal.close}
          onSubmit={(amount) => addWaterModal.data && handleAddWater(addWaterModal.data.containerId, amount)}
        />

        <ConnectModal
          isOpen={connectModal.isOpen}
          sourceContainer={connectModal.data}
          availableContainers={connectModal.data ? getAvailableContainers(connectModal.data) : []}
          onClose={connectModal.close}
          onConnect={(targetId) => connectModal.data && handleConnect(connectModal.data.id, targetId)}
        />

        {toast.isOpen && toast.data && (
          <Toast
            message={toast.data.message}
            type={toast.data.type}
            onClose={toast.close}
          />
        )}
      </div>
    </div>
  )
}