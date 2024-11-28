import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumbs: Array<{
    text: string;
    href?: string;
  }>;
  action?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  breadcrumbs,
  action,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>
        {action && (
          <Button
            variant="contained"
            startIcon={action.icon}
            onClick={action.onClick}
          >
            {action.text}
          </Button>
        )}
      </Box>
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography color="text.primary" key={crumb.text}>
              {crumb.text}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              to={crumb.href || '#'}
              underline="hover"
              color="inherit"
              key={crumb.text}
            >
              {crumb.text}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default PageHeader;
