'use client'

import React, { useState } from 'react'
import { CreateContainerDto } from '@/types'
import { Button } from '.'

interface AddContainerFormProps {
  onSubmit: (data: CreateContainerDto) => void
  isLoading?: boolean
}

export default function AddContainerForm({ onSubmit, isLoading = false }: AddContainerFormProps) {
  const [formData, setFormData] = useState<CreateContainerDto>({
    name: '',
    capacity: 10
  })

  const [errors, setErrors] = useState<Partial<CreateContainerDto>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseFloat(value) || 0 : value
    }))
    
    // 清除错误
    if (errors[name as keyof CreateContainerDto]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateContainerDto> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Container name is required'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Container name cannot exceed 100 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      // 重置表单
      setFormData({ name: '', capacity: 10 })
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Container Name"
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          
          <div className="col-md-3">
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className={`form-control ${errors.capacity ? 'is-invalid' : ''}`}
              placeholder="Capacity"
              step="0.1"
              min="0.1"
              required
            />
            {errors.capacity && (
              <div className="invalid-feedback">{errors.capacity}</div>
            )}
          </div>
          
          <div className="col-md-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-100"
            >
              {isLoading ? 'Adding...' : 'Add Container'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
