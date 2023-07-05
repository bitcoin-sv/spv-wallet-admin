import PropTypes from 'prop-types'
import React from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import MoneyIcon from '@mui/icons-material/Money';
import { Link } from "react-router-dom";

export const AdminCard = (
  {
    title,
    value,
    iconColor,
    Icon,
    listLink,
    ...rest
  }
) => (
  <Card
    sx={{ height: '100%' }}
    {...rest}
  >
    <CardContent>
      <Box>
        <Box marginBottom={2}>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            {title.toUpperCase()}
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {value}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="flex-end">
          <Link to={listLink} style={{ textDecoration: 'none' }}>
            Go to list
          </Link>
          <Avatar
            sx={{
              backgroundColor: iconColor,
              height: 56,
              width: 56
            }}
          >
            <Icon/>
          </Avatar>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

AdminCard.propTypes = {
  Icon: PropTypes.object.isRequired,
  iconColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}
