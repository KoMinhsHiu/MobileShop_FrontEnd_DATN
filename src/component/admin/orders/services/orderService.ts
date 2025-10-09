import { Order } from '../../admin.types';
import { StrictOrder, OrderUpdate, OrderResponse, ErrorResponse, SuccessResponse } from '../types/strictTypes';

/**
 * Simulate API delay
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Order service for API operations
 */
export class OrderService {
  /**
   * Get all orders
   */
  static async getOrders(): Promise<Order[]> {
    await delay(500); // Simulate network delay
    // In real app, this would be an API call
    return [];
  }

  /**
   * Get order by ID
   */
  static async getOrderById(id: string): Promise<Order | null> {
    await delay(300);
    // In real app, this would be an API call
    return null;
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: string, 
    status: string, 
    internalNotes?: string
  ): Promise<OrderResponse> {
    await delay(1000); // Simulate network delay
    
    // Simulate API error (10% chance)
    if (Math.random() < 0.1) {
      const error: ErrorResponse = {
        error: 'Network error occurred',
        code: 'NETWORK_ERROR'
      };
      throw new Error(error.error);
    }
    
    // In real app, this would be an API call
    // For now, return a mock updated order
    const mockOrder: OrderResponse = {
      id: orderId,
      orderNumber: '#DH001',
      customer: {
        id: '1',
        name: 'Mock Customer',
        phone: '0901234567',
        email: 'mock@example.com',
        address: 'Mock Address',
        city: 'Mock City',
        district: 'Mock District',
        ward: 'Mock Ward'
      },
      items: [],
      totalAmount: 0,
      paymentMethod: 'COD',
      status: status as any,
      orderDate: new Date().toISOString(),
      internalNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return mockOrder;
  }

  /**
   * Delete order
   */
  static async deleteOrder(orderId: string): Promise<void> {
    await delay(500);
    // In real app, this would be an API call
  }

  /**
   * Export orders to CSV
   */
  static async exportOrders(filters?: any): Promise<Blob> {
    await delay(1000);
    // In real app, this would generate and return CSV file
    return new Blob(['Mock CSV data'], { type: 'text/csv' });
  }
}

/**
 * Error handling utility
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Retry utility for failed requests
 */
export const retryRequest = async <T>(
  request: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await delay(delayMs * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  
  throw lastError;
};
