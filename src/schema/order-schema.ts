import { z } from "zod";

// Schema for creating a new order (POST /api/orders)
export const createOrderSchema = z.object({
  paymentMethod: z.string().min(1, "Payment method is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
});

// Schema for order status updates
export const orderStatusSchema = z.enum([
  "PENDING",
  "PAID", 
  "FAILED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED"
]);

// Schema for order item (for responses)
export const orderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for complete order (for responses)
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  totalAmount: z.number().positive(),
  status: orderStatusSchema,
  paymentMethod: z.string(),
  razorpayOrderId: z.string().nullable(),
  razorpayPaymentId: z.string().nullable(),
  razorpaySignature: z.string().nullable(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(orderItemSchema).optional(),
});

// Type exports for TypeScript
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;