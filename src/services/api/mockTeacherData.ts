
import { Teacher, Review, TeacherSpecialty } from "@/types/teacher";

export const generateMockTeachers = (count: number): Teacher[] => {
  const specialties: TeacherSpecialty[] = [
    'conversation',
    'grammar',
    'vocabulary',
    'reading',
    'writing',
    'business_korean',
    'exam_preparation'
  ];
  
  const languages = ['العربية', 'English', '한국어'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `teacher-${i + 1}`,
    profile: {
      first_name: `معلم${i + 1}`,
      last_name: `كوري${i + 1}`,
      avatar_url: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${(i % 70) + 1}.jpg`,
      bio: `أنا معلم لغة كورية مع خبرة ${2 + (i % 10)} سنوات. متخصص في تعليم القواعد والمحادثة للمبتدئين والمتوسطين.`
    },
    hourly_rate: 50 + (i * 10) % 150,
    education: `جامعة سيول، بكالوريوس في تعليم اللغة الكورية`,
    teaching_style: `أركز على المحادثة والتطبيق العملي للغة في الحياة اليومية`,
    years_experience: 2 + (i % 10),
    introduction_video_url: null,
    is_approved: true,
    specialties: [
      specialties[i % specialties.length],
      specialties[(i + 1) % specialties.length]
    ],
    languages_spoken: [
      '한국어',
      languages[i % languages.length]
    ],
    avg_rating: 3 + (Math.random() * 2),
    total_reviews: Math.floor(Math.random() * 50)
  }));
};

export const generateMockReviews = (teacherId: string, count: number): Review[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `review-${i}`,
    teacher_id: teacherId,
    student_id: `student-${i}`,
    booking_id: `booking-${i}`,
    rating: Math.floor(3 + Math.random() * 3),
    comment: `تجربة ممتازة مع هذا المعلم! تعلمت الكثير في وقت قصير`,
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    student: {
      first_name: `طالب${i + 1}`,
      last_name: `${i + 1}`,
      avatar_url: `https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${(i % 70) + 1}.jpg`
    }
  }));
};
