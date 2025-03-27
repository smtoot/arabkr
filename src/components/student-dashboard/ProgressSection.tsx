
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
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
import { GraduationCap, Target } from 'lucide-react';
import { fetchLearningGoals } from '@/services/api/student/learningGoalsService';
import { LearningGoalCard } from './LearningGoalCard';

interface ProgressSectionProps {
  firstName?: string;
}

export const ProgressSection = ({ firstName }: ProgressSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressValue, setProgressValue] = useState(0);
  
  // Fetch learning goals
  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ['learning-goals', user?.id],
    queryFn: () => user?.id ? fetchLearningGoals(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });
  
  // Calculate completed goals percentage
  const completedGoalsPercentage = goals && goals.length > 0
    ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100)
    : 0;
  
  // Simulate progress increase for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(completedGoalsPercentage || 30), 500);
    return () => clearTimeout(timer);
  }, [completedGoalsPercentage]);

  // Get top 3 in-progress goals
  const topInProgressGoals = goals
    ?.filter(g => !g.completed)
    .sort((a, b) => (b.current_value / b.target_value) - (a.current_value / a.target_value))
    .slice(0, 3);

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
            
            {!goalsLoading && topInProgressGoals && topInProgressGoals.length > 0 && (
              <div className="border-t pt-3 mt-3">
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Target className="h-4 w-4 text-primary" />
                  أهدافك قيد التقدم
                </p>
                <div className="space-y-2">
                  {topInProgressGoals.map(goal => {
                    const progress = goal.target_value > 0 
                      ? Math.min(100, (goal.current_value / goal.target_value) * 100) 
                      : 0;
                      
                    return (
                      <div key={goal.id} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <p className="text-foreground font-medium truncate">{goal.title}</p>
                          <p className="text-muted-foreground">{Math.round(progress)}%</p>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/student/learning-goals')}>
            عرض أهداف التعلم الكاملة
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
