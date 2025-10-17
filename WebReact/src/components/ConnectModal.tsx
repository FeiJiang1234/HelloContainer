'use client'

import React from 'react'
import { ContainerDto } from '@/types'
import { Button } from '.'

interface ConnectModalProps {
  isOpen: boolean
  sourceContainer: ContainerDto | null
  availableContainers: ContainerDto[]
  onClose: () => void
  onConnect: (sourceId: string, targetId: string) => void
  isLoading?: boolean
}

export default function ConnectModal({
  isOpen,
  sourceContainer,
  availableContainers,
  onClose,
  onConnect,
  isLoading = false
}: ConnectModalProps) {
  const handleConnect = (targetId: string) => {
    if (sourceContainer) {
      onConnect(sourceContainer.id, targetId)
    }
  }

  if (!isOpen || !sourceContainer) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="connect-modal" onClick={(e) => e.stopPropagation()}>
        <h5>Connect Container</h5>
        <p>
          Select a container to connect with <strong>{sourceContainer.name}</strong>:
        </p>
        
        <div className="connect-options">
          {availableContainers.length === 0 ? (
            <p className="text-muted">No containers available to connect.</p>
          ) : (
            availableContainers.map(container => (
              <div
                key={container.id}
                className="connect-option"
                onClick={() => handleConnect(container.id)}
              >
                <strong>{container.name}</strong>
                <br />
                <small>
                  Capacity: {container.capacity}L, Amount: {container.amount}L
                </small>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
