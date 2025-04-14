import React from "react"

interface DashboardHeaderProps {
  heading: string
  description?: string
}

export function DashboardHeader({
  heading,
  description,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-1 pb-6">
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
} 