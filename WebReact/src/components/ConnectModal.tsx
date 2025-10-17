'use client'

import { ContainerDto } from '@/types'
import { Button } from '.'

interface Props {
  isOpen: boolean
  sourceContainer: ContainerDto | null
  availableContainers: ContainerDto[]
  onClose: () => void
  onConnect: (targetId: string) => void
}

export default function ConnectModal({ isOpen, sourceContainer, availableContainers, onClose, onConnect }: Props) {
  if (!isOpen || !sourceContainer) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="connect-modal" onClick={(e) => e.stopPropagation()}>
        <h5>Connect Container</h5>
        <p>Select a container to connect with <strong>{sourceContainer.name}</strong>:</p>
        
        <div className="connect-options">
          {availableContainers.length === 0 ? (
            <p className="text-muted">No containers available to connect.</p>
          ) : (
            availableContainers.map(container => (
              <div
                key={container.id}
                className="connect-option"
                onClick={() => onConnect(container.id)}
              >
                <strong>{container.name}</strong>
                <br />
                <small>Capacity: {container.capacity}L, Amount: {container.amount}L</small>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}