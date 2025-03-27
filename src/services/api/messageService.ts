
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface Conversation {
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  last_message: string;
  last_message_time: string;
  is_read: boolean;
  sender_first_name: string;
  sender_last_name: string;
  sender_avatar: string | null;
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_avatar: string | null;
  message_count: number;
  unread_count: number;
}

// Fetch conversations for the current user
export async function fetchConversations(): Promise<Conversation[]> {
  try {
    // Since we're working with a view, we need to use the execute_sql function
    const { data, error } = await supabase
      .rpc('execute_sql', {
        query_text: "SELECT * FROM conversations"
      });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
    
    return (data || []) as Conversation[];
  } catch (error) {
    console.error('Error in fetchConversations:', error);
    throw error;
  }
}

// Fetch messages between current user and another user
export async function fetchMessages(otherUserId: string): Promise<Message[]> {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    
    if (!currentUser.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.user.id},recipient_id.eq.${currentUser.user.id}`)
      .and(`(sender_id.eq.${otherUserId}),or(recipient_id.eq.${otherUserId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchMessages:', error);
    throw error;
  }
}

// Send a message to another user
export async function sendMessage(
  recipientId: string, 
  content: string, 
  currentUser: User
): Promise<Message | null> {
  try {
    const newMessage = {
      sender_id: currentUser.id,
      recipient_id: recipientId,
      content,
      is_read: false
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([newMessage])
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

// Mark messages from a specific sender as read
export async function markMessagesAsRead(senderId: string): Promise<void> {
  try {
    // We need to use the SQL function we created
    const { error } = await supabase
      .rpc('execute_sql', {
        query_text: `SELECT mark_messages_as_read('${senderId}')`
      });

    if (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    throw error;
  }
}

// Subscribe to new messages
export function subscribeToMessages(
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel('messages_channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      },
      callback
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
