'use client'

import React from 'react'
import { ContainerDto } from '@/types'
import { Button } from '.'

interface ContainerCardProps {
  container: ContainerDto
  onAddWater: (id: string) => void
  onConnect: (id: string) => void
  onDelete: (id: string) => void
  onDisconnect: (sourceId: string, targetId: string) => void
  availableContainers: ContainerDto[]
}

export default function ContainerCard({
  container,
  onAddWater,
  onConnect,
  onDelete,
  onDisconnect,
  availableContainers
}: ContainerCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${container.name}?`)) {
      onDelete(container.id)
    }
  }

  const handleConnect = (targetId: string) => {
    if (window.confirm(`Connect ${container.name} with the selected container?`)) {
      onConnect(targetId)
    }
  }

  const handleDisconnect = (targetId: string) => {
    if (window.confirm(`Disconnect these containers?`)) {
      onDisconnect(container.id, targetId)
    }
  }

  return (
    <div className="container-card">
      {/* 容量标签 */}
      <div className="capacity-label">
        Capacity: {container.capacity.toFixed(1)}L
      </div>
      
      {/* 容器水箱 */}
      <div className="container-tank">
        <div 
          className={`water-level ${container.isFull ? 'full' : ''}`}
          style={{ height: `${container.fillPercentage * 100}%` }}
        />
        <div className="container-amount">
          {container.amount.toFixed(1)}
        </div>
      </div>
      
      {/* 容器信息 */}
      <div className="container-info">
        <div className="container-name">{container.name}</div>
        <div className="container-stats">
          {(container.fillPercentage * 100).toFixed(1)}%
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="container-actions">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAddWater(container.id)}
        >
          +
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onConnect(container.id)}
        >
          ⚡
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDelete}
        >
          🗑
        </Button>
      </div>
      
      {/* 连接线 */}
      {container.connectedContainerIds.map(connectedId => {
        const connectedContainer = availableContainers.find(c => c.id === connectedId)
        if (!connectedContainer) return null
        
        return (
          <div key={connectedId} className="connection-line">
            <div className="connection-line-visual" />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDisconnect(connectedId)}
              className="disconnect-btn"
            >
              ×
            </Button>
          </div>
        )
      })}
    </div>
  )
}
