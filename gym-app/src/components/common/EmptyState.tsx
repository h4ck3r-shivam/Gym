import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      {icon && (
        <Box
          sx={{
            mb: 2,
            color: 'text.secondary',
            '& > svg': {
              fontSize: 64,
            },
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: action ? 3 : 0, maxWidth: 'sm' }}
      >
        {description}
      </Typography>
      {action && (
        <Button variant="contained" onClick={action.onClick}>
          {action.text}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
