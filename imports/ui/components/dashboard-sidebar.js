import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import ViewListIcon from '@mui/icons-material/ViewList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';

import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { setAccessKeyString, setAdminKey, setXPrivString, setXPubString, useUser } from "../hooks/user";
import { Lock as LockIcon } from "../icons/lock";

const items = [
  {
    href: '/',
    icon: (<ChartBarIcon fontSize="small" />),
    title: 'Dashboard'
  },
  {
    href: '/xpub',
    icon: (<AutoFixHighIcon fontSize="small" />),
    title: 'xPub'
  },
  {
    href: '/destination',
    icon: (<LocationOnIcon fontSize="small" />),
    title: 'Destination'
  },
  {
    href: '/destinations',
    icon: (<LocationSearchingIcon fontSize="small" />),
    title: 'Destinations'
  },
  {
    href: '/destination-new',
    icon: (<AddLocationIcon fontSize="small" />),
    title: 'New Destination'
  },
  {
    href: '/transaction',
    icon: (<MonetizationOnIcon fontSize="small" />),
    title: 'Transaction'
  },
  {
    href: '/transactions',
    icon: (<ViewListIcon fontSize="small" />),
    title: 'Transactions'
  },
  {
    href: '/transaction-new',
    icon: (<AddIcon fontSize="small" />),
    title: 'New Transaction'
  },
  {
    href: '/access-keys',
    icon: (<KeyIcon fontSize="small" />),
    title: 'Access Keys'
  },
];

export const DashboardSidebar = (props) => {
  const { xPubId, adminId } = useUser();
  const { open, onClose } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <div>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'row' }}>
            <Logo
              sx={{
                height: 42,
                width: 42
              }}
            />
            <Box sx={{ ml: 2 }}>
              <Typography
                variant="h4"
              >
                Bux
              </Typography>
            </Box>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  XpubID
                </Typography>
                <Typography
                  color="inherit"
                  variant="body2"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '220px',
                  }}
                >
                  {xPubId}
                </Typography>
              </div>
            </Box>
            {adminId &&
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 3,
                  py: '11px',
                  borderRadius: 1
                }}
              >
                <div>
                  <Typography
                    color="inherit"
                    variant="subtitle1"
                  >
                    Admin ID
                  </Typography>
                  <Typography
                    color="inherit"
                    variant="body2"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '220px',
                    }}
                  >
                    {adminId}
                  </Typography>
                </div>
              </Box>
            }
            <Button
              startIcon={(<LockIcon fontSize="small" />)}
              sx={{ mr: 1 }}
              onClick={() => {
                setXPrivString('');
                setXPubString('');
                setAccessKeyString('');
                setAdminKey('');
              }}
            >
              Logout
            </Button>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
