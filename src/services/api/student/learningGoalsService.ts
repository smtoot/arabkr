
import { supabase } from "@/integrations/supabase/client";

export interface LearningGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  created_at: string;
  updated_at: string;
  completed: boolean;
}

export interface CreateLearningGoalParams {
  title: string;
  description?: string;
  target_value: number;
  unit: string;
}

export interface UpdateLearningGoalParams {
  title?: string;
  description?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  completed?: boolean;
}

export async function fetchLearningGoals(userId: string): Promise<LearningGoal[]> {
  const { data, error } = await supabase
    .from('learning_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching learning goals:', error);
    return [];
  }

  return data || [];
}

export async function createLearningGoal(
  userId: string, 
  goalData: CreateLearningGoalParams
): Promise<LearningGoal | null> {
  const { data, error } = await supabase
    .from('learning_goals')
    .insert({
      user_id: userId,
      title: goalData.title,
      description: goalData.description,
      target_value: goalData.target_value,
      current_value: 0,
      unit: goalData.unit,
      completed: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating learning goal:', error);
    return null;
  }

  return data;
}

export async function updateLearningGoal(
  goalId: string,
  userId: string,
  updates: UpdateLearningGoalParams
): Promise<LearningGoal | null> {
  const { data, error } = await supabase
    .from('learning_goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating learning goal:', error);
    return null;
  }

  return data;
}

export async function deleteLearningGoal(goalId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('learning_goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting learning goal:', error);
    return false;
  }

  return true;
}

export async function incrementGoalProgress(
  goalId: string,
  userId: string,
  incrementBy: number = 1
): Promise<LearningGoal | null> {
  // First get the current goal to check its current value
  const { data: goal, error: fetchError } = await supabase
    .from('learning_goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .single();

  if (fetchError) {
    console.error('Error fetching goal for update:', fetchError);
    return null;
  }

  const newValue = goal.current_value + incrementBy;
  const completed = newValue >= goal.target_value;

  // Update the goal with the new value
  const { data, error } = await supabase
    .from('learning_goals')
    .update({
      current_value: newValue,
      completed: completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error incrementing goal progress:', error);
    return null;
  }

  return data;
}
