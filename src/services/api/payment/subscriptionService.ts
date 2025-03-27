
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Gets the active subscription for a user
 */
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    toast.error('خطأ في جلب معلومات الاشتراك');
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

/**
 * Creates a new subscription for a user
 */
export async function createSubscription(
  userId: string, 
  subscription: {
    plan_name: string;
    price: number;
    end_date: string;
    payment_history_id: string;
  }
) {
  // Check if user has an active subscription
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  // If exists, cancel it
  if (existingSubscription) {
    await supabase
      .from('subscriptions')
      .update({ 
        status: 'cancelled', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', existingSubscription.id);
  }

  // Create new subscription
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_name: subscription.plan_name,
      status: 'active',
      end_date: subscription.end_date,
      price: subscription.price,
      payment_history_id: subscription.payment_history_id
    });

  if (error) {
    console.error('Error creating subscription:', error);
  }
}

/**
 * Cancels an active subscription
 */
export async function cancelSubscription(userId: string, subscriptionId: string) {
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', subscriptionId)
    .eq('user_id', userId);

  if (error) {
    toast.error('خطأ في إلغاء الاشتراك');
    console.error('Error cancelling subscription:', error);
    throw error;
  }

  toast.success('تم إلغاء الاشتراك بنجاح');
  return true;
}
