
// This file is deprecated - all functionality has been moved to separate services
// Re-exporting from the new location for backward compatibility

import {
  fetchTeacherProfile,
  updateTeacherProfile,
  uploadProfilePicture,
  fetchUpcomingLessons,
  fetchTeacherAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
  fetchTeacherStudents,
  fetchTeacherEarnings
} from './teacher';

export {
  fetchTeacherProfile,
  updateTeacherProfile,
  uploadProfilePicture,
  fetchUpcomingLessons,
  fetchTeacherAvailability,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
  fetchTeacherStudents,
  fetchTeacherEarnings
};
