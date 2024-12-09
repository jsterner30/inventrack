import React from 'react'

interface Props {
  companyName: string
  avatarUrl: string
}

export const AccountSwitcher: React.FC<Props> = ({ companyName, avatarUrl }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
      <img
        src={avatarUrl}
        alt='Company Avatar'
        className='rounded-circle me-2'
        style={{ width: '45px', height: '45px' }}
      />
      <div style={{ padding: '10px', color: 'black', background: '#B3B9C5', borderRadius: '8px', height: '45px', marginLeft: "10px"}}>{companyName}</div>
    </div>
  )
}
