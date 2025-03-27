
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LearningGoal,
  fetchLearningGoals,
  createLearningGoal,
  updateLearningGoal,
  deleteLearningGoal,
  incrementGoalProgress,
  CreateLearningGoalParams
} from '@/services/api/student/learningGoalsService';
import { LearningGoalCard } from './LearningGoalCard';
import { LearningGoalDialog } from './LearningGoalDialog';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { EmptyStateCard } from '../teacher-dashboard/EmptyStateCard';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const LearningGoalsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<LearningGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  // Fetch learning goals
  const { data: goals, isLoading, isError } = useQuery({
    queryKey: ['learning-goals', user?.id],
    queryFn: () => user?.id ? fetchLearningGoals(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });
  
  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: (goalData: CreateLearningGoalParams) => {
      return user?.id 
        ? createLearningGoal(user.id, goalData)
        : Promise.resolve(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-goals', user?.id] });
      toast({
        title: "تم إنشاء الهدف بنجاح",
        description: "تم إضافة هدف التعلم الجديد الخاص بك",
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "فشل في إنشاء الهدف",
        description: "حدث خطأ أثناء إنشاء هدف التعلم الخاص بك",
      });
    }
  });
  
  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: (data: { goalId: string, updates: Partial<LearningGoal> }) => {
      return user?.id 
        ? updateLearningGoal(data.goalId, user.id, data.updates)
        : Promise.resolve(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-goals', user?.id] });
      toast({
        title: "تم تحديث الهدف بنجاح",
        description: "تم تحديث هدف التعلم الخاص بك",
      });
      setDialogOpen(false);
      setEditingGoal(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث الهدف",
        description: "حدث خطأ أثناء تحديث هدف التعلم الخاص بك",
      });
    }
  });
  
  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: string) => {
      return user?.id 
        ? deleteLearningGoal(goalId, user.id)
        : Promise.resolve(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-goals', user?.id] });
      toast({
        title: "تم حذف الهدف بنجاح",
        description: "تم حذف هدف التعلم الخاص بك",
      });
      setGoalToDelete(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "فشل في حذف الهدف",
        description: "حدث خطأ أثناء حذف هدف التعلم الخاص بك",
      });
    }
  });
  
  // Increment goal progress mutation
  const incrementGoalMutation = useMutation({
    mutationFn: (data: { goalId: string, amount: number }) => {
      return user?.id 
        ? incrementGoalProgress(data.goalId, user.id, data.amount)
        : Promise.resolve(null);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['learning-goals', user?.id] });
      if (data?.completed) {
        toast({
          title: "تهانينا! 🎉",
          description: "لقد أكملت هدف التعلم الخاص بك",
        });
      } else {
        toast({
          title: "تم تحديث التقدم",
          description: "تم تحديث تقدم هدف التعلم الخاص بك",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "فشل في تحديث التقدم",
        description: "حدث خطأ أثناء تحديث تقدم هدف التعلم الخاص بك",
      });
    }
  });
  
  const handleCreateGoal = (data: CreateLearningGoalParams) => {
    createGoalMutation.mutate(data);
  };
  
  const handleUpdateGoal = (data: CreateLearningGoalParams) => {
    if (editingGoal) {
      updateGoalMutation.mutate({
        goalId: editingGoal.id,
        updates: data
      });
    }
  };
  
  const handleEditGoal = (goalId: string) => {
    const goal = goals?.find(g => g.id === goalId);
    if (goal) {
      setEditingGoal(goal);
      setDialogOpen(true);
    }
  };
  
  const handleDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId);
  };
  
  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      deleteGoalMutation.mutate(goalToDelete);
    }
  };
  
  const handleIncrementGoal = (goalId: string, amount: number) => {
    incrementGoalMutation.mutate({ goalId, amount });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          أهداف التعلم الشخصية
        </h2>
        <Button onClick={() => { setEditingGoal(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" />
          هدف جديد
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse bg-muted rounded-lg"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-4 text-center">
          <p className="text-destructive">حدث خطأ أثناء تحميل أهداف التعلم الخاصة بك</p>
        </div>
      ) : goals?.length === 0 ? (
        <EmptyStateCard
          icon={Target}
          title="لا توجد أهداف تعلم بعد"
          description="قم بإنشاء أهداف تعلم مخصصة لتتبع تقدمك في تعلم اللغة الكورية"
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {goals?.map((goal) => (
            <LearningGoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              onIncrement={handleIncrementGoal}
            />
          ))}
        </div>
      )}
      
      {/* Add/Edit Dialog */}
      <LearningGoalDialog
        isOpen={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingGoal(null); }}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        initialData={editingGoal || undefined}
        isEditing={!!editingGoal}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!goalToDelete} 
        onOpenChange={(open) => !open && setGoalToDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الهدف؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الهدف نهائيًا من حسابك.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteGoal}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
