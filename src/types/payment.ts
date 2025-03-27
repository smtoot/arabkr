
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentType = 'wallet_recharge' | 'lesson_payment' | 'subscription';
export type PaymentMethodType = 'card' | 'bank' | 'wallet';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: PaymentMethodType;
  details: any;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_type: PaymentType;
  payment_method_id?: string;
  transaction_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  payment_methods?: PaymentMethod;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration_days: number;
  features: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  price: number;
  currency: string;
  auto_renew: boolean;
  payment_history_id: string;
  created_at: string;
  updated_at: string;
}

// Sample subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'الباقة الأساسية',
    price: 99,
    currency: 'SAR',
    duration_days: 30,
    features: [
      'درسان خاصان شهرياً',
      'الوصول إلى مكتبة الدروس الأساسية',
      'دعم محدود عبر الرسائل'
    ]
  },
  {
    id: 'standard',
    name: 'الباقة القياسية',
    price: 249,
    currency: 'SAR',
    duration_days: 30,
    features: [
      '5 دروس خاصة شهرياً',
      'الوصول إلى مكتبة الدروس الكاملة',
      'دعم متميز عبر الرسائل',
      'مراجعة الواجبات والتمارين'
    ]
  },
  {
    id: 'premium',
    name: 'الباقة المتميزة',
    price: 499,
    currency: 'SAR',
    duration_days: 30,
    features: [
      '10 دروس خاصة شهرياً',
      'الوصول إلى جميع محتويات المنصة',
      'دعم فوري على مدار الساعة',
      'مراجعة الواجبات والتمارين',
      'اختبارات مستوى وشهادات إتمام'
    ]
  }
];
