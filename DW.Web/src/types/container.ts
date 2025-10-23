export interface ContainerDto {
  id: string
  name: string
  capacity: number
  amount: number
  connectedContainerIds: string[]
  fillPercentage: number
  isFull: boolean
}