import { useState, useEffect } from 'react'
import { ContainerDto, CreateContainerDto } from '@/types'
import { containerApi } from '@/services'

export function useContainers() {
  const [containers, setContainers] = useState<ContainerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadContainers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await containerApi.getContainers()
      setContainers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load containers')
    } finally {
      setLoading(false)
    }
  }

  const createContainer = async (data: CreateContainerDto) => {
    try {
      await containerApi.create(data)
      await loadContainers()
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create container'
      setError(error)
      return { success: false, error }
    }
  }

  const deleteContainer = async (id: string) => {
    try {
      await containerApi.delete(id)
      await loadContainers()
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete container'
      setError(error)
      return { success: false, error }
    }
  }

  const addWater = async (id: string, amount: number) => {
    try {
      await containerApi.addWater(id, { amount })
      await loadContainers()
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add water'
      setError(error)
      return { success: false, error }
    }
  }

  const connectContainers = async (sourceId: string, targetId: string) => {
    try {
      await containerApi.connect({ sourceContainerId: sourceId, targetContainerId: targetId })
      await loadContainers()
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to connect containers'
      setError(error)
      return { success: false, error }
    }
  }

  const disconnectContainers = async (sourceId: string, targetId: string) => {
    try {
      await containerApi.disconnect({ sourceContainerId: sourceId, targetContainerId: targetId })
      await loadContainers()
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to disconnect containers'
      setError(error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    loadContainers()
  }, [])

  return {
    containers,
    loading,
    error,
    createContainer,
    deleteContainer,
    addWater,
    connectContainers,
    disconnectContainers,
    refresh: loadContainers
  }
}
