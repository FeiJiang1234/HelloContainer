'use client'

import React, { useState } from 'react'
import { Button } from '.'

interface AddWaterModalProps {
  isOpen: boolean
  containerId: string
  containerName: string
  onClose: () => void
  onSubmit: (containerId: string, amount: number) => void
  isLoading?: boolean
}

export default function AddWaterModal({
  isOpen,
  containerId,
  containerName,
  onClose,
  onSubmit,
  isLoading = false
}: AddWaterModalProps) {
  const [amount, setAmount] = useState<number>(1)
  const [error, setError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    
    setError('')
    onSubmit(containerId, amount)
  }

  const handleClose = () => {
    setAmount(1)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="connect-modal" onClick={(e) => e.stopPropagation()}>
        <h5>Add Water to Container</h5>
        <p>Adding water to: <strong>{containerName}</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="waterAmount" className="form-label">
              Amount (Liters):
            </label>
            <input
              type="number"
              id="waterAmount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className={`form-control ${error ? 'is-invalid' : ''}`}
              step="0.1"
              min="0.1"
              required
            />
            {error && (
              <div className="invalid-feedback">{error}</div>
            )}
          </div>
          
          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Water'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
