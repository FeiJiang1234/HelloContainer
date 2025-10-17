import { 
  ContainerDto, 
  CreateContainerDto, 
  AddWaterDto, 
  ConnectContainersDto, 
  DisconnectContainersDto 
} from '@/types'

// API 基础 URL - 在实际项目中应该从环境变量获取
const API_BASE_URL = 'https://localhost:7054'

class ContainerApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  // 获取所有容器
  async getContainers(searchKeyword?: string): Promise<ContainerDto[]> {
    let url = `${this.baseUrl}/api/containers`
    if (searchKeyword) {
      url += `?searchKeyword=${encodeURIComponent(searchKeyword)}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch containers: ${response.statusText}`)
    }

    return response.json()
  }

  // 根据 ID 获取容器
  async getContainerById(id: string): Promise<ContainerDto> {
    const response = await fetch(`${this.baseUrl}/api/containers/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch container: ${response.statusText}`)
    }

    return response.json()
  }

  // 创建新容器
  async createContainer(createDto: CreateContainerDto): Promise<ContainerDto> {
    const response = await fetch(`${this.baseUrl}/api/containers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createDto),
    })

    if (!response.ok) {
      throw new Error(`Failed to create container: ${response.statusText}`)
    }

    return response.json()
  }

  // 向容器添加水
  async addWater(id: string, addWaterDto: AddWaterDto): Promise<ContainerDto> {
    const response = await fetch(`${this.baseUrl}/api/containers/${id}/water`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addWaterDto),
    })

    if (!response.ok) {
      throw new Error(`Failed to add water: ${response.statusText}`)
    }

    return response.json()
  }

  // 删除容器
  async deleteContainer(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/containers/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete container: ${response.statusText}`)
    }
  }

  // 连接容器
  async connectContainers(connectDto: ConnectContainersDto): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/containers/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(connectDto),
    })

    if (!response.ok) {
      throw new Error(`Failed to connect containers: ${response.statusText}`)
    }
  }

  // 断开容器连接
  async disconnectContainers(disconnectDto: DisconnectContainersDto): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/containers/disconnections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(disconnectDto),
    })

    if (!response.ok) {
      throw new Error(`Failed to disconnect containers: ${response.statusText}`)
    }
  }
}

// 创建单例实例
export const containerApi = new ContainerApiClient()

// 导出类以便测试
export { ContainerApiClient }
