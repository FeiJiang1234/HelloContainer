'use client'

import { useState } from 'react'
import { CreateContainerDto } from '@/types'
import { Button } from '.'

interface Props {
  onSubmit: (data: CreateContainerDto) => void
  isLoading?: boolean
}

export default function AddContainerForm({ onSubmit, isLoading = false }: Props) {
  const [form, setForm] = useState({ name: '', capacity: 10 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name.trim() && form.capacity > 0) {
      onSubmit(form)
      setForm({ name: '', capacity: 10 })
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Add New Container</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="form-control"
              placeholder="Container Name"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm(prev => ({ ...prev, capacity: +e.target.value }))}
              className="form-control"
              placeholder="Capacity"
              step="0.1"
              min="0.1"
              required
            />
          </div>
          <div className="col-md-2">
            <Button type="submit" variant="primary" disabled={isLoading} className="w-100">
              {isLoading ? 'Adding...' : 'Add Container'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}