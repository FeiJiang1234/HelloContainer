// 容器数据传输对象
export interface ContainerDto {
  id: string
  name: string
  capacity: number
  amount: number
  connectedContainerIds: string[]
  fillPercentage: number
  isFull: boolean
}

// 简化的数据传输对象
export interface CreateContainerDto {
  name: string
  capacity: number
}

export interface AddWaterDto {
  amount: number
}

export interface ConnectDto {
  sourceContainerId: string
  targetContainerId: string
}
