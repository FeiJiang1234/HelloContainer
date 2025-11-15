'use client'

import { useState } from 'react'
import { Button } from '.'

interface Props {
  isOpen: boolean
  containerName: string
  onClose: () => void
  onSubmit: (amount: number) => void
}

export default function AddWaterModal({ isOpen, containerName, onClose, onSubmit }: Props) {
  const [amount, setAmount] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (amount > 0) {
      onSubmit(amount)
      setAmount(1)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="connect-modal" onClick={(e) => e.stopPropagation()}>
        <h5>Add Water to {containerName}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Amount (Liters):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
              className="form-control"
              step="0.1"
              min="0.1"
              required
            />
          </div>
          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">Add Water</Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  )
}