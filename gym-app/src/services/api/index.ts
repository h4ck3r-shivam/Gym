// Consolidated API Service Exports
export { default as authAPI } from './auth';
export { default as bookingAPI } from './booking';
export { default as gymAPI } from './gym';
export { default as slotAPI } from './slot';
export { default as userAPI } from './user';
export { default as notificationAPI } from './notifications';
export { default as reviewAPI } from './reviews';
export { default as analyticsAPI } from './analytics';
export { default as settingsAPI } from './settings';
export { default as paymentAPI } from './payments';

// Re-export types for convenience
export * from '../../types';