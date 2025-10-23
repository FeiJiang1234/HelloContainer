import { ContainerDto } from '../types'

const API_BASE = 'https://localhost:7054/api/containers'

// 简化的 API 客户端
export const containerApi = {
  // 获取容器列表
  async getContainers(search?: string): Promise<ContainerDto[]> {
    const url = search ? `${API_BASE}?searchKeyword=${encodeURIComponent(search)}` : API_BASE
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch containers')
    return response.json()
  }
}