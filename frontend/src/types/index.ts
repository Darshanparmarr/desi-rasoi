export interface SubCategory {
  _id: string;
  name: string;
  category: string | { _id: string; name: string };
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  ingredients: string[];
  image: string;
  images: string[];
  stock: number;
  featured: boolean;
  weight: string;
  rating: number;
  numReviews: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'employee' | 'admin';
  token?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  _id: string;
  user: User;
  orderItems: CartItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  deliveredBy?: User;
  deliveryPhoto?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface BulkInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  eventType: string;
  eventDate: string;
  estimatedGuests: number;
  products: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  message: string;
  status: 'Pending' | 'Contacted' | 'Quoted' | 'Closed';
  createdAt?: string;
  updatedAt?: string;
}

