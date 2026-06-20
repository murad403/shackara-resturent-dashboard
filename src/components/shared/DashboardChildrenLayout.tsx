import React from 'react'

type TProps = {
    title?: string;
    subtitle?: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode
}

const DashboardChildrenLayout = ({ title, subtitle, headerAction, children }: TProps) => {
  return (
    <div className="space-y-4 md:space-y-6 w-full mx-auto">
      {(title || subtitle || headerAction) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-title">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm md:text-base text-subtitle">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-3 shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      
      <div>
        {children}
      </div>
    </div>
  )
}

export default DashboardChildrenLayout