import React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardSidebar } from './dashboard-sidebar';
import ErrorBoundary from './error-boundary';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280,
  },
}));

export const DashboardLayout = (props) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <DashboardLayoutRoot>
        <ErrorBoundary>
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              width: '100%',
              margin: 2,
            }}
          >
            {children}
          </Box>
        </ErrorBoundary>
      </DashboardLayoutRoot>
      <DashboardSidebar onClose={() => setSidebarOpen(false)} open={isSidebarOpen} />
    </>
  );
};
