import React from 'react';

interface Props {
  companyName: string;
  avatarUrl: string;
}

export const AccountSwitcher: React.FC<Props> = ({ companyName, avatarUrl }) => {
  return (
    <div className="d-flex align-items-center border rounded p-2 bg-light">
      <img
        src={avatarUrl}
        alt="Company Avatar"
        className="rounded-circle me-2"
        style={{ width: '45px', height: '45px' }}
      />
      <span className="fw-medium">{companyName}</span>
    </div>
  );
};