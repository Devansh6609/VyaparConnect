// src/types.ts

// Since Prisma enums can cause issues in client components/non-server environments,
// it's safer to define string literal types for statuses.

export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "CONFIRMED"
  | "BILLED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "CANCELLED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type OrderItemStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type OrderPaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";
export type WorkflowType = "QUOTATION_FOCUSED" | "ORDER_FOCUSED" | "HYBRID";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  category?: string | null;
  inStock: boolean;
  stockQuantity: number;
  images: ProductImage[];
  workflow: WorkflowType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  imageUrl?: string; // Often added client-side for convenience
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: "PAID" | "PENDING" | "FAILED";
  notes?: string | null;
  createdAt: string;
  quotationId?: string | null;
  orderId?: string | null;
  razorpayPaymentId?: string | null;
}

export interface QuotationItem {
  id: string;
  quantity: number;
  price: number;
  productId?: string | null;
  product?: Product | null;
  quotationId: string;
}

export interface Quotation {
  id: string;
  customerName: string;
  contactNumber: string;
  billingAddress: string | null;
  shippingAddress: string | null;
  subtotal: number;
  total: number;
  status: QuotationStatus;
  discountPercentage?: number | null;
  taxRate?: number | null;
  deliveryCharges?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  contactId: string;
  userId: string;
  items: QuotationItem[];
  payments: Payment[];
  paymentLinkId?: string | null;
  paymentLinkUrl?: string | null;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: string;
  price: number;
  status: OrderItemStatus;
  orderId: string;
  productId?: string | null;
  product?: Product | null;
}

export interface Order {
  id: string;
  customerName: string;
  contactNumber: string;
  billingAddress: string | null;
  shippingAddress: string | null;
  subtotal: number;
  total: number;
  discountPercentage?: number | null;
  deliveryCharges?: number | null;
  notes?: string | null;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  createdAt: string;
  updatedAt: string;
  contactId: string;
  userId: string;
  items: OrderItem[];
  payments: Payment[];
  contact: Contact;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string | null;
  isMasterCustomer: boolean;
  stage:
    | "NEW_LEAD"
    | "CONTACTED"
    | "QUOTATION_SENT"
    | "PAYMENT_PENDING"
    | "COMPLETED"
    | "LOST";
  lastAddress?: string | null;
  lastBillingAddress?: string | null;
  lastShippingAddress?: string | null;
  shippingAddress?: string | null;
  bankDetails?: string | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: Tag[];
  // Properties often added client-side
  lastMessage?: string;
  lastMessageAt?: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  contactId: string;
}

export interface ContactDetails extends Contact {
  notes: Note[];
  quotations: Quotation[];
}

export interface Message {
  id: string;
  from: "business" | "customer";
  to: string;
  text?: string | null;
  mediaUrl?: string | null;
  fileName?: string | null;
  type: "text" | "image" | "document" | "product" | "unsupported";
  status: "pending" | "sent" | "delivered" | "read" | "failed" | "received";
  createdAt: string;
  wamid?: string | null;
  contactId: string;
  contact?: Contact;
  productId?: string | null;
  product?: Product | null;
  replyToId?: string | null;
  replyToText?: string | null;
  replyToMediaUrl?: string | null;
  groupId?: string | null;
}

export interface DashboardData {
  totalRevenue: number;
  revenueChange: number;
  newCustomers: number;
  newCustomersChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  pendingPayments: number;
  pendingPaymentItems: PendingPaymentItem[];
  revenueLast7Days: { day: string; revenue: number }[];
  recentActivity: Contact[];
  salesFunnel: { stage: string; count: number }[];
  followUpItems: FollowUpItem[];
  pendingOrders: Order[];
  aiSummary?: string;
}

export interface PendingPaymentItem {
  id: string;
  type: "quotation" | "order";
  customerName: string;
  total: number;
  contactId: string;
  updatedAt: string;
  payments: { amount: number }[];
}

export interface CustomerPipelineItem {
  id: string;
  name: string;
  stage: "NEW_LEAD" | "CONTACTED" | "SENT" | "BILLED" | "PAID" | "CANCELLED";
  latestActivity: string;
}

export interface FollowUpItem {
  quotationId: string;
  contactId: string;
  contactName: string;
  quotationTotal: number;
  sentAt: string;
}

export interface BroadcastRecipient {
  id: string;
  status: "PENDING" | "SENT" | "FAILED";
  contact: Contact;
}

export interface Broadcast {
  id: string;
  message: string;
  templateId: string;
  status: "PENDING" | "SENDING" | "COMPLETED" | "FAILED";
  sentAt: string;
  recipients: BroadcastRecipient[];
  _count?: {
    recipients: number;
  };
}

export interface Group {
  id: string;
  name: string;
  whatsappGroupId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  messages?: Message[];
}

export interface Transaction {
  id: string;
  customerName: string;
  date: string;
  totalValue: number;
  status: QuotationStatus;
  contactId: string;
  itemsSummary: string;
  itemCount: number;
}
