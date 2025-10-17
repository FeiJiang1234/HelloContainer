'use client'

import { useState, useEffect } from 'react'
import { ContainerDto, CreateContainerDto } from '@/types'
import { containerApi } from '@/services'
import { ContainerCard, AddContainerForm, AddWaterModal, ConnectModal } from '@/components'

export default function ContainersPage() {
  const [containers, setContainers] = useState<ContainerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  
  const [addWaterModal, setAddWaterModal] = useState<{ isOpen: boolean; containerId: string; containerName: string }>({
    isOpen: false, containerId: '', containerName: ''
  })
  
  const [connectModal, setConnectModal] = useState<{ isOpen: boolean; sourceContainer: ContainerDto | null }>({
    isOpen: false, sourceContainer: null
  })

  const loadContainers = async () => {
    try {
      setLoading(true)
      const data = await containerApi.getContainers()
      setContainers(data)
    } catch (err) {
      setMessage('Failed to load containers')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: CreateContainerDto) => {
    try {
      await containerApi.create(data)
      setMessage('Container created successfully!')
      loadContainers()
    } catch (err) {
      setMessage('Failed to create container')
    }
  }

  const handleAddWater = async (containerId: string, amount: number) => {
    try {
      await containerApi.addWater(containerId, { amount })
      setMessage('Water added successfully!')
      setAddWaterModal({ isOpen: false, containerId: '', containerName: '' })
      loadContainers()
    } catch (err) {
      setMessage('Failed to add water')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await containerApi.delete(id)
      setMessage('Container deleted successfully!')
      loadContainers()
    } catch (err) {
      setMessage('Failed to delete container')
    }
  }

  const handleConnect = async (sourceId: string, targetId: string) => {
    try {
      await containerApi.connect({ sourceContainerId: sourceId, targetContainerId: targetId })
      setMessage('Containers connected successfully!')
      setConnectModal({ isOpen: false, sourceContainer: null })
      loadContainers()
    } catch (err) {
      setMessage('Failed to connect containers')
    }
  }

  const handleDisconnect = async (sourceId: string, targetId: string) => {
    try {
      await containerApi.disconnect({ sourceContainerId: sourceId, targetContainerId: targetId })
      setMessage('Containers disconnected successfully!')
      loadContainers()
    } catch (err) {
      setMessage('Failed to disconnect containers')
    }
  }

  const getAvailableContainers = (sourceContainer: ContainerDto): ContainerDto[] => {
    return containers.filter(c => 
      c.id !== sourceContainer.id && 
      !sourceContainer.connectedContainerIds.includes(c.id)
    )
  }

  useEffect(() => {
    loadContainers()
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading containers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom section-padding">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Container Management</h1>

        {message && (
          <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'} mb-4`}>
            {message}
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
                    setAddWaterModal({ isOpen: true, containerId: id, containerName: container?.name || '' })
                  }}
                  onConnect={(id) => {
                    const container = containers.find(c => c.id === id)
                    setConnectModal({ isOpen: true, sourceContainer: container || null })
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
          containerName={addWaterModal.containerName}
          onClose={() => setAddWaterModal({ isOpen: false, containerId: '', containerName: '' })}
          onSubmit={(amount) => handleAddWater(addWaterModal.containerId, amount)}
        />

        <ConnectModal
          isOpen={connectModal.isOpen}
          sourceContainer={connectModal.sourceContainer}
          availableContainers={connectModal.sourceContainer ? getAvailableContainers(connectModal.sourceContainer) : []}
          onClose={() => setConnectModal({ isOpen: false, sourceContainer: null })}
          onConnect={(targetId) => connectModal.sourceContainer && handleConnect(connectModal.sourceContainer.id, targetId)}
        />
      </div>
    </div>
  )
}