import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { reviewAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Review } from '../../types';

interface ReviewListProps {
  gymId: string;
  onReviewAdded?: () => void;
}

const validationSchema = Yup.object({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: Yup.string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters'),
});

const ReviewList: React.FC<ReviewListProps> = ({ gymId, onReviewAdded }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [gymId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getGymReviews(gymId);
      setReviews(response.data.data.reviews);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      rating: 5,
      comment: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await reviewAPI.createReview(gymId, values);
        await fetchReviews();
        if (onReviewAdded) onReviewAdded();
        handleCloseDialog();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to submit review');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
  };

  if (loading && !dialogOpen) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Reviews</Typography>
          {currentUser && (
            <Button variant="contained" onClick={handleOpenDialog}>
              Write Review
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {reviews.map((review, index) => (
          <React.Fragment key={review._id}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 2 }}>
                  {review.user.firstName[0]}
                  {review.user.lastName[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {review.user.firstName} {review.user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(review.createdAt), 'PP')}
                  </Typography>
                </Box>
              </Box>
              <Rating value={review.rating} readOnly precision={0.5} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {review.comment}
              </Typography>
            </Box>
            {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
          </React.Fragment>
        ))}

        {reviews.length === 0 && (
          <Typography color="text.secondary" align="center">
            No reviews yet. Be the first to review!
          </Typography>
        )}

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={formik.handleSubmit}>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogContent>
              <Box sx={{ my: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating
                  name="rating"
                  value={formik.values.rating}
                  onChange={(event, newValue) => {
                    formik.setFieldValue('rating', newValue);
                  }}
                />
                {formik.touched.rating && formik.errors.rating && (
                  <Typography color="error" variant="caption">
                    {formik.errors.rating}
                  </Typography>
                )}
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">
                Submit Review
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReviewList;
