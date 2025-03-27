
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  LearningGoal,
  fetchLearningGoals,
  createLearningGoal,
  updateLearningGoal,
  deleteLearningGoal,
  incrementGoalProgress,
  CreateLearningGoalParams
} from '@/services/api/student/learningGoalsService';

export const useLearningGoals = () => {
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
    onError: () => {
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
    onError: () => {
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
    onError: () => {
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
    onError: () => {
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

  return {
    goals,
    isLoading,
    isError,
    dialogOpen,
    setDialogOpen,
    editingGoal,
    setEditingGoal,
    goalToDelete,
    setGoalToDelete,
    handleCreateGoal,
    handleUpdateGoal,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    handleIncrementGoal
  };
};
