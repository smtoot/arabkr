
import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProgressSectionProps {
  firstName?: string;
}

export const ProgressSection = ({ firstName }: ProgressSectionProps) => {
  const navigate = useNavigate();
  const [progressValue, setProgressValue] = useState(0);
  
  // Simulate progress increase for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(30), 500);
    return () => clearTimeout(timer);
  }, []);

  // Learning goals (would typically come from an API)
  const learningGoals = [
    { id: 1, title: "إتقان المحادثة الأساسية", progress: 45 },
    { id: 2, title: "تعلم 500 كلمة شائعة", progress: 60 },
    { id: 3, title: "إتقان النطق الصحيح", progress: 25 },
  ];

  return (
    <>
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            مرحبًا، {firstName || 'الطالب'}
          </CardTitle>
          <CardDescription>
            رحلتك في تعلم اللغة الكورية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">التقدم الكلي</p>
              <Progress value={progressValue} className="h-2" />
              <p className="text-sm text-muted-foreground mt-1">
                أتممت {progressValue}% من خطة التعلم الخاصة بك
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/student/learning-plan')}>
            عرض خطة التعلم الكاملة
          </Button>
        </CardFooter>
      </Card>

      <h2 className="text-xl font-semibold mb-4 mt-8">أهداف التعلم</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {learningGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{goal.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={goal.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {goal.progress}% مكتمل
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
