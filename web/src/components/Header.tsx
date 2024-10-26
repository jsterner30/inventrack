import React from 'react'
import { AccountSwitcher } from './AccountSwitcher'

interface Props {
  logoUrl: string
}

export const Header: React.FC<Props> = ({ logoUrl }) => {
  return (
    <header className='bg-light py-3 px-4 d-flex justify-content-between align-items-center'>
      <img
        src={logoUrl}
        alt='Company Logo'
        className='img-fluid'
        style={{ maxWidth: '248px' }}
      />
      <AccountSwitcher
        companyName='Scartin Industries'
        avatarUrl='https://cdn.builder.io/api/v1/image/assets/TEMP/97b097bd80be5942eb32fde89eb501b3a607ac1eb7555219d21f9585a475d9e6?placeholderIfAbsent=true&apiKey=c71af66328b44f89bad6bec599ea2336'
      />
    </header>
  )
}
