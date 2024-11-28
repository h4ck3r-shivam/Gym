import api from './config';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled';
  clientSecret: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate: string;
  paidAt?: string;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
}

export const paymentsApi = {
  createPaymentIntent: async (amount: number, currency: string = 'usd') => {
    const response = await api.post<PaymentIntent>('/payments/create-intent', {
      amount,
      currency,
    });
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string) => {
    const response = await api.post<PaymentIntent>(
      `/payments/confirm/${paymentIntentId}`
    );
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get<PaymentMethod[]>('/payments/methods');
    return response.data;
  },

  addPaymentMethod: async (paymentMethodId: string) => {
    const response = await api.post<PaymentMethod>('/payments/methods', {
      paymentMethodId,
    });
    return response.data;
  },

  removePaymentMethod: async (paymentMethodId: string) => {
    await api.delete(`/payments/methods/${paymentMethodId}`);
  },

  setDefaultPaymentMethod: async (paymentMethodId: string) => {
    const response = await api.put<PaymentMethod>(
      `/payments/methods/${paymentMethodId}/default`
    );
    return response.data;
  },

  createSubscription: async (priceId: string, paymentMethodId?: string) => {
    const response = await api.post<Subscription>('/payments/subscriptions', {
      priceId,
      paymentMethodId,
    });
    return response.data;
  },

  cancelSubscription: async (subscriptionId: string) => {
    const response = await api.delete<Subscription>(
      `/payments/subscriptions/${subscriptionId}`
    );
    return response.data;
  },

  updateSubscription: async (
    subscriptionId: string,
    priceId: string
  ) => {
    const response = await api.put<Subscription>(
      `/payments/subscriptions/${subscriptionId}`,
      { priceId }
    );
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get<Subscription>('/payments/subscription');
    return response.data;
  },

  getInvoices: async () => {
    const response = await api.get<Invoice[]>('/payments/invoices');
    return response.data;
  },

  getInvoice: async (invoiceId: string) => {
    const response = await api.get<Invoice>(`/payments/invoices/${invoiceId}`);
    return response.data;
  },

  refund: async (paymentIntentId: string, amount?: number) => {
    const response = await api.post(`/payments/refund/${paymentIntentId}`, {
      amount,
    });
    return response.data;
  },
};
