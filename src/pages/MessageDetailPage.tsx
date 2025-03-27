
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';
import MessageComposer from '@/components/messages/MessageComposer';
import ConversationHeader from '@/components/messages/ConversationHeader';

export default function MessageDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading || isLoading) {
    return <div>جاري التحميل...</div>;
  }

  if (!userId) {
    navigate('/messages');
    return null;
  }

  return (
    <Layout>
      <div className="container py-8" dir="rtl">
        <h1 className="text-2xl font-bold mb-6">الرسائل</h1>

        <Card className="shadow-md">
          <div className="grid md:grid-cols-12">
            <div className="hidden md:block md:col-span-4 border-l">
              <div className="p-3 border-b">
                <h2 className="font-medium text-lg">المحادثات</h2>
              </div>
              <ConversationList selectedUserId={userId} />
            </div>
            
            <div className="col-span-12 md:col-span-8 flex flex-col h-[70vh] md:h-[600px]">
              <ConversationHeader userId={userId} />
              
              <div className="flex-1 overflow-hidden">
                {userProfile && (
                  <MessageThread 
                    userId={userId}
                    userName={`${userProfile.first_name} ${userProfile.last_name}`.trim()}
                    userAvatar={userProfile.avatar_url}
                  />
                )}
              </div>
              
              <MessageComposer recipientId={userId} />
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
