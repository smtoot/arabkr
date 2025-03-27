
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationHeaderProps {
  userId: string;
}

export default function ConversationHeader({ userId }: ConversationHeaderProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*, teachers(*)')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="p-3 border-b flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="mr-2"
          onClick={() => navigate('/messages')}
        >
          <ArrowLeft />
        </Button>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24 mt-1" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-3 border-b flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="mr-2"
          onClick={() => navigate('/messages')}
        >
          <ArrowLeft />
        </Button>
        <div>المستخدم غير موجود</div>
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  const isTeacher = profile.role === 'teacher';

  return (
    <div className="p-3 border-b flex items-center">
      <Button 
        variant="ghost" 
        size="icon"
        className="mr-2"
        onClick={() => navigate('/messages')}
      >
        <ArrowLeft />
      </Button>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar_url || undefined} alt={fullName} />
          <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium text-sm">{fullName}</h4>
          <p className="text-xs text-muted-foreground">
            {isTeacher ? 'معلم' : 'طالب'}
          </p>
        </div>
      </div>
    </div>
  );
}
