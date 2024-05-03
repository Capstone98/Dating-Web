import React from 'react';
import AdminState from '../AdminComponents/AdminState';
import AdminRender from '../AdminComponents/AdminRender';

export const Admin = ({ isAdmin }) => {
  return (
    <AdminState isAdmin={isAdmin} />
  );
};
