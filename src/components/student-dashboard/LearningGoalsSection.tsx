
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';
import { LearningGoalDialog } from './LearningGoalDialog';
import { useLearningGoals } from './learning-goals/useLearningGoals';
import { LearningGoalsList } from './learning-goals/LearningGoalsList';
import { DeleteGoalDialog } from './learning-goals/DeleteGoalDialog';

export const LearningGoalsSection = () => {
  const {
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
  } = useLearningGoals();
  
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
      
      <LearningGoalsList
        goals={goals}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
        onIncrement={handleIncrementGoal}
      />
      
      {/* Add/Edit Dialog */}
      <LearningGoalDialog
        isOpen={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingGoal(null); }}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        initialData={editingGoal || undefined}
        isEditing={!!editingGoal}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteGoalDialog
        isOpen={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={confirmDeleteGoal}
      />
    </div>
  );
};
