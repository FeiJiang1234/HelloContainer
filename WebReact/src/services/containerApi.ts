import { ContainerDto, CreateContainerDto, AddWaterDto, ConnectDto } from '@/types'

const API_BASE = 'https://localhost:7054/api/containers'

// 简化的 API 客户端
export const containerApi = {
  // 获取容器列表
  async getContainers(search?: string): Promise<ContainerDto[]> {
    const url = search ? `${API_BASE}?searchKeyword=${encodeURIComponent(search)}` : API_BASE
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch containers')
    return response.json()
  },

  // 创建容器
  async create(data: CreateContainerDto): Promise<ContainerDto> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create container')
    return response.json()
  },

  // 添加水
  async addWater(id: string, data: AddWaterDto): Promise<ContainerDto> {
    const response = await fetch(`${API_BASE}/${id}/water`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to add water')
    return response.json()
  },

  // 删除容器
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Failed to delete container')
  },

  // 连接容器
  async connect(data: ConnectDto): Promise<void> {
    const response = await fetch(`${API_BASE}/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to connect containers')
  },

  // 断开连接
  async disconnect(data: ConnectDto): Promise<void> {
    const response = await fetch(`${API_BASE}/disconnections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to disconnect containers')
  },
}