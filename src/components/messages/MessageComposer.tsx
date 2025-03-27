
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sendMessage } from '@/services/api/messageService';
import { SendHorizonal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageComposerProps {
  recipientId: string;
}

export default function MessageComposer({ recipientId }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    try {
      setIsSending(true);
      await sendMessage(recipientId, message.trim(), user);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: "destructive",
        title: "فشل في إرسال الرسالة",
        description: "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-t">
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 resize-none focus-visible:ring-1"
          rows={2}
          maxLength={1000}
          dir="rtl"
        />
        <Button 
          type="submit" 
          className="self-end"
          size="icon"
          disabled={!message.trim() || isSending}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
