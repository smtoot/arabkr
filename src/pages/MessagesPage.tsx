
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from 'lucide-react';
import ConversationList from '@/components/messages/ConversationList';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <Layout>
      <div className="container py-8" dir="rtl">
        <h1 className="text-2xl font-bold mb-6">الرسائل</h1>

        <Card className="shadow-md">
          <div className="grid md:grid-cols-12">
            <div className="col-span-12 md:col-span-4 border-l">
              <div className="p-3 border-b">
                <h2 className="font-medium text-lg">المحادثات</h2>
              </div>
              <ConversationList />
            </div>
            
            <div className="col-span-12 md:col-span-8 flex flex-col justify-center items-center p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">اختر محادثة</h3>
              <p>اختر محادثة من القائمة لعرض الرسائل</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
