import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteProductModalProps {
  isOpen: boolean
  productName: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteProductModal = ({ 
  isOpen, 
  productName, 
  onClose, 
  onConfirm 
}: DeleteProductModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      {/* Modal Dialog Box */}
      <div 
        className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in-50 zoom-in-95 duration-200 flex flex-col items-center text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <AlertTriangle className="w-6 h-6 stroke-2" />
        </div>

        {/* Text Area */}
        <div className="space-y-1.5 w-full">
          <h3 className="text-lg font-bold text-title">Delete Product</h3>
          <p className="text-sm text-subtitle/90 leading-normal">
            Are you sure you want to delete <span className="font-semibold text-title">"{productName}"</span>? This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3.5 pt-2 w-full">
          {/* Cancel Trigger */}
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-10 font-semibold cursor-pointer border-gray-200 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </Button>

          {/* Delete Action Trigger */}
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 font-semibold cursor-pointer bg-red-600 hover:bg-red-700 text-white shadow-sm hover:opacity-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteProductModal