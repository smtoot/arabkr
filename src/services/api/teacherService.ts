
// Re-export all teacher-related functions from their respective modules
export { 
  fetchTeachers,
  fetchTeacherById
} from './teacher/index';

export { 
  fetchTeacherAvailability 
} from './teacher/availabilityService';

export { 
  fetchTeacherReviews 
} from './reviewsApi';

export { 
  generateMockTeachers, 
  generateMockReviews 
} from './mockTeacherData';
