
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchMessages, markMessagesAsRead, subscribeToMessages, Message } from '@/services/api/messageService';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { Check, CheckCheck } from 'lucide-react';

export interface MessageThreadProps {
  userId: string;
  userName: string;
  userAvatar?: string | null;
}

export default function MessageThread({ userId, userName, userAvatar }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchMessages(userId);
        setMessages(data);
        
        // Mark messages as read
        await markMessagesAsRead(userId);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
    
    // Set up real-time subscription
    const unsubscribe = subscribeToMessages((payload) => {
      const newMessage = payload.new as Message;
      
      // Only add messages that are part of this conversation
      if ((newMessage.sender_id === userId && newMessage.recipient_id === user?.id) ||
          (newMessage.sender_id === user?.id && newMessage.recipient_id === userId)) {
        setMessages(prev => [...prev, newMessage]);
        
        // If we received a message, mark it as read
        if (newMessage.sender_id === userId) {
          markMessagesAsRead(userId);
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [userId, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`flex items-start ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className={`h-24 w-64 rounded-lg ${i % 2 === 0 ? 'bg-primary/20' : 'bg-muted'}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
        <p className="mb-2">لا توجد رسائل</p>
        <p className="text-sm">ابدأ المحادثة عن طريق إرسال رسالة.</p>
      </div>
    );
  }

  // Group messages by date
  const messagesByDate: { [date: string]: Message[] } = {};
  messages.forEach(message => {
    const date = new Date(message.created_at).toLocaleDateString('ar-SA');
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(message);
  });

  return (
    <div className="overflow-y-auto p-4 space-y-6">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative px-4 bg-background text-xs font-medium text-muted-foreground">
              {format(new Date(dateMessages[0].created_at), 'EEEE, d MMMM', { locale: ar })}
            </div>
          </div>
          
          {dateMessages.map((message) => {
            const isMine = message.sender_id === user?.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex items-end gap-2 ${isMine ? 'justify-end' : ''}`}
              >
                {!isMine && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar || undefined} alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-4 py-2 rounded-xl break-words ${
                      isMine 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <span>{format(new Date(message.created_at), 'h:mm a', { locale: ar })}</span>
                    {isMine && (
                      message.is_read ? <CheckCheck size={14} /> : <Check size={14} />
                    )}
                  </div>
                </div>
                
                {isMine && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>{user?.user_metadata?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
