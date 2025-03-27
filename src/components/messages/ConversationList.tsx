
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fetchConversations, Conversation } from '@/services/api/messageService';
import { format } from 'date-fns';
import { arAR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationList({ selectedUserId }: { selectedUserId?: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchConversations();
        setConversations(data);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
    
    // Set up periodic refresh - every 30 seconds
    const intervalId = setInterval(loadConversations, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 rtl:space-x-reverse">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <p className="mb-2">لا توجد محادثات</p>
        <p className="text-sm">ابدأ محادثة جديدة عن طريق إرسال رسالة إلى معلم</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        // Determine if this conversation is with the sender or recipient
        const isWithSender = user?.id === conversation.recipient_id;
        const otherPersonId = isWithSender ? conversation.sender_id : conversation.recipient_id;
        const otherPersonName = isWithSender 
          ? `${conversation.sender_first_name} ${conversation.sender_last_name}`
          : `${conversation.recipient_first_name} ${conversation.recipient_last_name}`;
        const otherPersonAvatar = isWithSender ? conversation.sender_avatar : conversation.recipient_avatar;
        const isSelected = selectedUserId === otherPersonId;
        const hasUnread = isWithSender && !conversation.is_read && conversation.unread_count > 0;
        
        return (
          <div 
            key={conversation.conversation_id}
            className={`p-3 flex items-start space-x-3 rtl:space-x-reverse cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? 'bg-muted' : ''}`}
            onClick={() => navigate(`/messages/${otherPersonId}`)}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={otherPersonAvatar || undefined} alt={otherPersonName} />
              <AvatarFallback>{otherPersonName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-sm truncate">{otherPersonName}</h4>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(conversation.last_message_time), 'dd MMM', { locale: arAR })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                  {conversation.last_message}
                </p>
                {hasUnread && (
                  <Badge className="bg-primary text-white text-xs" variant="default">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
