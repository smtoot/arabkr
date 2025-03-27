
// Re-export all teacher-related functions from their respective modules
export { 
  fetchTeachers, 
  fetchTeacherById, 
  fetchTeacherAvailability 
} from './teacherApi';

export { 
  fetchTeacherReviews 
} from './reviewsApi';

export { 
  generateMockTeachers, 
  generateMockReviews 
} from './mockTeacherData';
