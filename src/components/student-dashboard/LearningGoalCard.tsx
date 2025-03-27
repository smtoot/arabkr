
import { useState } from 'react';
import { LearningGoal } from '@/services/api/student/learningGoalsService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Flag, Edit, Trash2, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LearningGoalCardProps {
  goal: LearningGoal;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onIncrement: (goalId: string, amount: number) => void;
  compact?: boolean;
}

export const LearningGoalCard = ({ 
  goal, 
  onEdit, 
  onDelete, 
  onIncrement,
  compact = false 
}: LearningGoalCardProps) => {
  const [hover, setHover] = useState(false);
  
  const progress = goal.target_value > 0 
    ? Math.min(100, (goal.current_value / goal.target_value) * 100) 
    : 0;
  
  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        hover && "border-primary shadow-md", 
        goal.completed && "bg-muted/30"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardHeader className="pb-2">
        <CardTitle className={cn("flex items-center gap-2 text-lg", compact && "text-base")}>
          <Flag className={cn("h-5 w-5 text-primary", compact && "h-4 w-4")} />
          {goal.title}
          {goal.completed && <Check className="h-4 w-4 text-green-500 ml-auto" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {!compact && goal.description && (
            <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
          )}
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {goal.current_value} / {goal.target_value} {goal.unit}
            </span>
            <span>{Math.round(progress)}% مكتمل</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className={cn("flex justify-between gap-2", compact && "pt-0")}>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(goal.id)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">تعديل</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(goal.id)}
            className="h-8 w-8 p-0 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">حذف</span>
          </Button>
        </div>
        <Button 
          size="sm" 
          onClick={() => onIncrement(goal.id, 1)}
          disabled={goal.completed}
          variant="secondary"
        >
          <Plus className="h-4 w-4 mr-1" /> إضافة تقدم
        </Button>
      </CardFooter>
    </Card>
  );
};
