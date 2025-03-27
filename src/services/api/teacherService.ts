
// Re-export all teacher-related functions from their respective modules
export { 
  fetchTeachers,
  fetchTeacherById
} from './teacher/index';

export { 
  fetchTeacherAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot
} from './teacher/availabilityService';

export { 
  fetchTeacherReviews,
  createReview,
  updateReview,
  deleteReview
} from './reviewsApi';

export {
  fetchTeacherSpecialties,
  addTeacherSpecialty,
  removeTeacherSpecialty
} from './teacher/specialtiesService';

export {
  fetchTeacherLanguages,
  addTeacherLanguage,
  removeTeacherLanguage
} from './teacher/languagesService';

export {
  updateTeacherProfileComplete
} from './teacher/profileManagementService';

export { 
  uploadProfilePicture
} from './teacher/profileService';

export { 
  generateMockTeachers, 
  generateMockReviews 
} from './mockTeacherData';
