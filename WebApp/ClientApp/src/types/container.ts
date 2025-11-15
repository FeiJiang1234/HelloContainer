export interface ContainerDto {
  id: string
  name: string
  capacity: number
  amount: number
  connectedContainerIds: string[]
  fillPercentage: number
  isFull: boolean
}

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
