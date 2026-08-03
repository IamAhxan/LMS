'use client'
import React, { FC, useState } from 'react'
import DashboardHeader from '../../components/Admin/DashboardHeader'
import DashboardWidgets from '../../components/Admin/DashboardWidgets'

type Props = {
  isDashboard?: boolean;
}

const DashboardHero: FC<Props> = ({ isDashboard }) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <DashboardHeader open={open} setOpen={setOpen} />
      {isDashboard && (
        <DashboardWidgets open={false} />
      )}
    </div>
  )
}

export default DashboardHero;