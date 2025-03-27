
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, MessageSquare, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActionsCard = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>إجراءات سريعة</CardTitle>
        <CardDescription>أدوات مساعدة للتعلم</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button variant="outline" className="justify-start" onClick={() => navigate('/teachers')}>
          <Video className="mr-2 h-4 w-4" />
          حجز درس جديد
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/messages')}>
          <MessageSquare className="mr-2 h-4 w-4" />
          الرسائل
        </Button>
        <Button variant="outline" className="justify-start" onClick={() => navigate('/student/resources')}>
          <GraduationCap className="mr-2 h-4 w-4" />
          مصادر التعلم
        </Button>
      </CardContent>
    </Card>
  );
};
