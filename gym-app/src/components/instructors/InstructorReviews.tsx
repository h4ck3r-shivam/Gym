import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Avatar,
  Rating,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  classAttended?: string;
}

interface InstructorReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  canReview: boolean;
  onAddReview?: (rating: number, comment: string) => Promise<void>;
}

const InstructorReviews: React.FC<InstructorReviewsProps> = ({
  reviews,
  averageRating,
  totalReviews,
  canReview,
  onAddReview,
}) => {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState<number | null>(0);
  const [comment, setComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setComment('');
  };

  const handleSubmit = async () => {
    if (rating && comment && onAddReview) {
      setIsSubmitting(true);
      try {
        await onAddReview(rating, comment);
        handleClose();
      } catch (error) {
        console.error('Error submitting review:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Reviews
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </Typography>
          </Box>
        </Box>
        {canReview && (
          <Button variant="contained" onClick={handleClickOpen}>
            Write Review
          </Button>
        )}
      </Box>

      {reviews.map((review, index) => (
        <React.Fragment key={review.id}>
          {index > 0 && <Divider sx={{ my: 3 }} />}
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar src={review.userAvatar} alt={review.userName}>
                {review.userName[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">
                      {review.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(review.date), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} size="small" readOnly />
                </Box>
                {review.classAttended && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    Class: {review.classAttended}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {review.comment}
                </Typography>
              </Box>
            </Box>
          </Box>
        </React.Fragment>
      ))}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography gutterBottom>Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
          </Box>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            label="Your Review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!rating || !comment || isSubmitting}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default InstructorReviews;
