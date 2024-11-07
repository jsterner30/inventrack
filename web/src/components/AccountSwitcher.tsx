import React from 'react'

interface Props {
  companyName: string
  avatarUrl: string
}

export const AccountSwitcher: React.FC<Props> = ({ companyName, avatarUrl }) => {
  return (
    <div style={{ background: '#BEB8A7', borderRadius: '8px' }}>
      <img
        src={avatarUrl}
        alt='Company Avatar'
        className='rounded-circle me-2'
        style={{ width: '45px', height: '45px' }}
      />
      <span style={{ padding: '5px' }}>{companyName}</span>
    </div>
  )
}
