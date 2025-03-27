
// Re-export all teacher API services
export * from './profileService';
// Don't re-export uploadProfilePicture from profileManagementService as it's already exported from profileService
export { 
  updateTeacherProfileComplete
} from './profileManagementService';
export * from './lessonService';
export * from './availabilityService';
export * from './studentService';
export * from './earningsService';
export * from './teacherListingService';
export * from './detailService';
export * from './specialtiesService';
export * from './languagesService';
