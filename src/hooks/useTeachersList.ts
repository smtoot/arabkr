
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Teacher, TeacherFilters, SortOption, TeacherSpecialty } from '@/types/teacher';
import { fetchTeachers } from '@/services/api/teacherApi';
import { useToast } from '@/hooks/use-toast';

export function useTeachersList(pageSize: number = 9) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TeacherFilters>({});
  const [sort, setSort] = useState<SortOption>('rating');
  
  useEffect(() => {
    // Parse filters from URL
    const urlPage = parseInt(searchParams.get('page') || '1');
    const urlSort = searchParams.get('sort') as SortOption || 'rating';
    const urlMinPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') || '0') : undefined;
    const urlMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') || '0') : undefined;
    const urlMinRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating') || '0') : undefined;
    const urlSpecialties = searchParams.get('specialties')?.split(',') as TeacherSpecialty[] | undefined;
    const urlLanguages = searchParams.get('languages')?.split(',');
    
    setCurrentPage(urlPage);
    setSort(urlSort);
    setFilters({
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      minRating: urlMinRating,
      specialties: urlSpecialties,
      languages: urlLanguages
    });
    
    // Load teachers
    loadTeachers(urlPage, {
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      minRating: urlMinRating,
      specialties: urlSpecialties,
      languages: urlLanguages
    }, urlSort);
  }, [searchParams]);
  
  const loadTeachers = async (page: number, filters: TeacherFilters, sort: SortOption) => {
    setLoading(true);
    try {
      const { teachers: fetchedTeachers, count } = await fetchTeachers(page, pageSize, filters, sort);
      setTeachers(fetchedTeachers);
      setTotalTeachers(count || 0);
    } catch (error) {
      console.error('Error loading teachers:', error);
      toast({
        title: "خطأ في تحميل قائمة المعلمين",
        description: "يرجى المحاولة مرة أخرى لاحقًا",
        variant: "destructive",
      });
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFiltersChange = (newFilters: TeacherFilters) => {
    // Update URL with new filters
    const params = new URLSearchParams();
    params.set('page', '1'); // Reset to page 1 when filters change
    params.set('sort', sort);
    
    if (newFilters.minPrice !== undefined) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice !== undefined) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.minRating !== undefined) params.set('minRating', newFilters.minRating.toString());
    if (newFilters.specialties && newFilters.specialties.length > 0) {
      params.set('specialties', newFilters.specialties.join(','));
    }
    if (newFilters.languages && newFilters.languages.length > 0) {
      params.set('languages', newFilters.languages.join(','));
    }
    
    setSearchParams(params);
  };
  
  const handleSortChange = (newSort: SortOption) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  const totalPages = Math.ceil(totalTeachers / pageSize);
  
  return {
    teachers,
    totalTeachers,
    loading,
    currentPage,
    filters,
    sort,
    totalPages,
    handleFiltersChange,
    handleSortChange,
    handlePageChange
  };
}
