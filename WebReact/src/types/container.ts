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

// 创建容器数据传输对象
export interface CreateContainerDto {
  name: string
  capacity: number
}

// 添加水数据传输对象
export interface AddWaterDto {
  amount: number
}

// 连接容器数据传输对象
export interface ConnectContainersDto {
  sourceContainerId: string
  targetContainerId: string
}

// 断开容器连接数据传输对象
export interface DisconnectContainersDto {
  sourceContainerId: string
  targetContainerId: string
}
