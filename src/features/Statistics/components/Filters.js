import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import { useFetch } from 'hooks/useFetch'
import { mapFilters } from 'const'

const filterLabels = {
  [mapFilters.general]: 'General',
  [mapFilters.currentMonth]: 'Mes actual',
  [mapFilters.previousMonth]: 'Mes anterior',
  [mapFilters.campaign]: 'Campaña',
}

const Filters = ({ onSelect }) => {
  const [campaigns] = useFetch({ url: '/campaigns' })
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState(mapFilters.general)
  const [selectedCampaign, setSelectedCampaign] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = (type, id = null) => {
    setAnchorEl(null)
    if (!type) return
    setSelectedFilter(type)
    setSelectedCampaign(id ? campaigns.find(c => c.id === id).name : null)
    onSelect({
      type,
      id,
    })
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        background: 'white',
        border: '1px solid #ccc',
        padding: '10px 20px',
      }}
    >
      <Button onClick={handleClick}>
        {filterLabels[selectedFilter]} {selectedCampaign}
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => handleClose()}>
        <MenuItem onClick={() => handleClose(mapFilters.general)}>General</MenuItem>
        <MenuItem onClick={() => handleClose(mapFilters.currentMonth)}>Mes actual</MenuItem>
        <MenuItem onClick={() => handleClose(mapFilters.previousMonth)}>Mes anterior</MenuItem>
        {campaigns.map(campaign => (
          <MenuItem key={campaign.id} onClick={() => handleClose(mapFilters.campaign, campaign.id)}>
            {campaign.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export { Filters }
