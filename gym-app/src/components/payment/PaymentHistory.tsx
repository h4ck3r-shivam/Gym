import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
} from '@mui/material';
import {
  Receipt,
  GetApp,
  FilterList,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'successful' | 'pending' | 'failed';
  type: 'membership' | 'booking' | 'other';
  description: string;
  transactionId: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  onDownloadInvoice: (paymentId: string) => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  payments,
  onDownloadInvoice,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedPayment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'membership':
        return 'Membership Fee';
      case 'booking':
        return 'Booking Payment';
      default:
        return 'Other Payment';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h6">Payment History</Typography>
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            size="small"
          >
            Filter
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
                .map((payment) => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>
                      {format(new Date(payment.date), 'PP')}
                    </TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(payment.type)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetails(payment)}
                      >
                        <Receipt />
                      </IconButton>
                      {payment.status === 'successful' && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            onDownloadInvoice(payment.id)
                          }
                        >
                          <GetApp />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={payments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          maxWidth="sm"
          fullWidth
        >
          {selectedPayment && (
            <>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Transaction ID
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.transactionId}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {format(
                          new Date(selectedPayment.date),
                          'PPpp'
                        )}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Amount
                      </Typography>
                      <Typography variant="body1">
                        ₹{selectedPayment.amount}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.description}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                {selectedPayment.status === 'successful' && (
                  <Button
                    startIcon={<GetApp />}
                    onClick={() =>
                      onDownloadInvoice(selectedPayment.id)
                    }
                  >
                    Download Invoice
                  </Button>
                )}
                <Button onClick={handleCloseDetails}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
