'use client'

import React, { useState, useEffect } from 'react'
import { ContainerDto, CreateContainerDto } from '@/types'
import { containerApi } from '@/services'
import { 
  ContainerCard, 
  AddContainerForm, 
  AddWaterModal, 
  ConnectModal 
} from '@/components'

export default function ContainersPage() {
  const [containers, setContainers] = useState<ContainerDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  
  // 模态框状态
  const [addWaterModal, setAddWaterModal] = useState<{
    isOpen: boolean
    containerId: string
    containerName: string
  }>({
    isOpen: false,
    containerId: '',
    containerName: ''
  })
  
  const [connectModal, setConnectModal] = useState<{
    isOpen: boolean
    sourceContainer: ContainerDto | null
  }>({
    isOpen: false,
    sourceContainer: null
  })

  // 加载容器数据
  const loadContainers = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await containerApi.getContainers()
      setContainers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load containers')
    } finally {
      setIsLoading(false)
    }
  }

  // 创建容器
  const handleCreateContainer = async (data: CreateContainerDto) => {
    try {
      setError('')
      await containerApi.createContainer(data)
      setSuccess('Container created successfully!')
      await loadContainers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create container')
    }
  }

  // 添加水
  const handleAddWater = async (containerId: string, amount: number) => {
    try {
      setError('')
      await containerApi.addWater(containerId, { amount })
      setSuccess('Water added successfully!')
      setAddWaterModal({ isOpen: false, containerId: '', containerName: '' })
      await loadContainers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add water')
    }
  }

  // 删除容器
  const handleDeleteContainer = async (containerId: string) => {
    try {
      setError('')
      await containerApi.deleteContainer(containerId)
      setSuccess('Container deleted successfully!')
      await loadContainers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete container')
    }
  }

  // 连接容器
  const handleConnectContainers = async (sourceId: string, targetId: string) => {
    try {
      setError('')
      await containerApi.connectContainers({ sourceContainerId: sourceId, targetContainerId: targetId })
      setSuccess('Containers connected successfully!')
      setConnectModal({ isOpen: false, sourceContainer: null })
      await loadContainers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect containers')
    }
  }

  // 断开容器连接
  const handleDisconnectContainers = async (sourceId: string, targetId: string) => {
    try {
      setError('')
      await containerApi.disconnectContainers({ sourceContainerId: sourceId, targetContainerId: targetId })
      setSuccess('Containers disconnected successfully!')
      await loadContainers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect containers')
    }
  }

  // 显示添加水模态框
  const showAddWaterModal = (containerId: string, containerName: string) => {
    setAddWaterModal({ isOpen: true, containerId, containerName })
  }

  // 显示连接模态框
  const showConnectModal = (containerId: string) => {
    const sourceContainer = containers.find(c => c.id === containerId)
    if (sourceContainer) {
      setConnectModal({ isOpen: true, sourceContainer })
    }
  }

  // 获取可连接的容器
  const getAvailableContainers = (sourceContainer: ContainerDto): ContainerDto[] => {
    return containers.filter(c => 
      c.id !== sourceContainer.id && 
      !sourceContainer.connectedContainerIds.includes(c.id)
    )
  }

  // 清除消息
  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  // 组件挂载时加载数据
  useEffect(() => {
    loadContainers()
  }, [])

  // 自动清除成功消息
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  if (isLoading) {
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
        <div className="row">
          <div className="col-md-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Container Management</h1>
          </div>
        </div>

        {/* 错误和成功消息 */}
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={clearMessages}
              aria-label="Close"
            ></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4" role="alert">
            {success}
            <button 
              type="button" 
              className="btn-close" 
              onClick={clearMessages}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* 添加容器表单 */}
        <AddContainerForm onSubmit={handleCreateContainer} />

        {/* 容器列表 */}
        {containers.length > 0 ? (
          <div className="container-graph mt-8">
            {containers.map((container, index) => (
              <div key={container.id} style={{ position: 'absolute', left: `${index * 150 + 50}px` }}>
                <ContainerCard
                  container={container}
                  onAddWater={showAddWaterModal}
                  onConnect={showConnectModal}
                  onDelete={handleDeleteContainer}
                  onDisconnect={handleDisconnectContainers}
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

        {/* 模态框 */}
        <AddWaterModal
          isOpen={addWaterModal.isOpen}
          containerId={addWaterModal.containerId}
          containerName={addWaterModal.containerName}
          onClose={() => setAddWaterModal({ isOpen: false, containerId: '', containerName: '' })}
          onSubmit={handleAddWater}
        />

        <ConnectModal
          isOpen={connectModal.isOpen}
          sourceContainer={connectModal.sourceContainer}
          availableContainers={connectModal.sourceContainer ? getAvailableContainers(connectModal.sourceContainer) : []}
          onClose={() => setConnectModal({ isOpen: false, sourceContainer: null })}
          onConnect={handleConnectContainers}
        />
      </div>
    </div>
  )
}
