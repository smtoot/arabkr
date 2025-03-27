
import { LearningGoal } from '@/services/api/student/learningGoalsService';
import { LearningGoalCard } from '../LearningGoalCard';
import { EmptyStateCard } from '../teacher-dashboard/EmptyStateCard';
import { Target } from 'lucide-react';

interface LearningGoalsListProps {
  goals: LearningGoal[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onEdit: (goalId: string) => void;
  onDelete: (goalId: string) => void;
  onIncrement: (goalId: string, amount: number) => void;
}

export const LearningGoalsList = ({
  goals,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onIncrement
}: LearningGoalsListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 animate-pulse bg-muted rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-4 text-center">
        <p className="text-destructive">حدث خطأ أثناء تحميل أهداف التعلم الخاصة بك</p>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <EmptyStateCard
        icon={Target}
        title="لا توجد أهداف تعلم بعد"
        description="قم بإنشاء أهداف تعلم مخصصة لتتبع تقدمك في تعلم اللغة الكورية"
      />
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <LearningGoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
          onIncrement={onIncrement}
        />
      ))}
    </div>
  );
};
