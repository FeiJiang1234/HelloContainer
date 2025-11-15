'use client'

import { ContainerDto } from '@/types'
import { Button } from '.'

interface Props {
  container: ContainerDto
  onAddWater: (id: string) => void
  onConnect: (id: string) => void
  onDelete: (id: string) => void
}

export default function ContainerCard({ container, onAddWater, onConnect, onDelete }: Props) {
  const handleDelete = () => {
    if (window.confirm(`Delete ${container.name}?`)) {
      onDelete(container.id)
    }
  }

  // 计算填充百分比，确保数据有效
  const fillPercentage = container.capacity > 0 
    ? Math.min(container.amount / container.capacity, 1) 
    : 0

  return (
    <div className="container-card">
      <div className="capacity-label">Capacity: {container.capacity.toFixed(1)}L</div>
      
      <div className="container-tank">
        <div 
          className={`water-level ${container.isFull ? 'full' : ''}`}
          style={{ height: `${fillPercentage * 100}%` }}
        />
        <div className="container-amount">{container.amount.toFixed(1)}</div>
      </div>
      
      <div className="container-info">
        <div className="container-name">{container.name}</div>
        <div className="container-stats">{(fillPercentage * 100).toFixed(1)}%</div>
      </div>
      
      <div className="container-actions">
        <Button variant="primary" size="sm" onClick={() => onAddWater(container.id)}>+</Button>
        <Button variant="outline" size="sm" onClick={() => onConnect(container.id)}>⚡</Button>
        <Button variant="secondary" size="sm" onClick={handleDelete}>🗑</Button>
      </div>
    </div>
  )
}