
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import TeacherCard from '@/components/teachers/TeacherCard';
import TeacherFilters from '@/components/teachers/TeacherFilters';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Teacher, TeacherFilters as FilterType, SortOption, TeacherSpecialty } from '@/types/teacher';
import { fetchTeachers, generateMockTeachers } from '@/services/api/teacherService';
import { Skeleton } from '@/components/ui/skeleton';

const TeachersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterType>({});
  const [sort, setSort] = useState<SortOption>('rating');
  
  const pageSize = 9;
  
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
  
  const loadTeachers = async (page: number, filters: FilterType, sort: SortOption) => {
    setLoading(true);
    try {
      // Uncomment this when we want to use real data
      // const { teachers: fetchedTeachers, count } = await fetchTeachers(page, pageSize, filters, sort);
      // setTeachers(fetchedTeachers);
      // setTotalTeachers(count || 0);
      
      // For now, use mock data
      const mockTeachers = generateMockTeachers(30);
      
      // Apply filters to mock data (simplified)
      let filteredTeachers = mockTeachers;
      if (filters.minPrice !== undefined) {
        filteredTeachers = filteredTeachers.filter(t => t.hourly_rate >= (filters.minPrice || 0));
      }
      if (filters.maxPrice !== undefined) {
        filteredTeachers = filteredTeachers.filter(t => t.hourly_rate <= (filters.maxPrice || 1000));
      }
      if (filters.minRating !== undefined) {
        filteredTeachers = filteredTeachers.filter(t => t.avg_rating >= (filters.minRating || 0));
      }
      
      // Sort mock data
      if (sort === 'rating') {
        filteredTeachers.sort((a, b) => b.avg_rating - a.avg_rating);
      } else if (sort === 'price_low') {
        filteredTeachers.sort((a, b) => a.hourly_rate - b.hourly_rate);
      } else if (sort === 'price_high') {
        filteredTeachers.sort((a, b) => b.hourly_rate - a.hourly_rate);
      } else if (sort === 'experience') {
        filteredTeachers.sort((a, b) => (b.years_experience || 0) - (a.years_experience || 0));
      }
      
      // Paginate
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setTeachers(filteredTeachers.slice(start, end));
      setTotalTeachers(filteredTeachers.length);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFiltersChange = (newFilters: FilterType) => {
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
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" dir="rtl">معلمي اللغة الكورية</h1>
          <p className="text-muted-foreground" dir="rtl">ابحث عن المعلم المناسب لتعلم اللغة الكورية</p>
        </div>
        
        <TeacherFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          activeSort={sort}
          onSortChange={handleSortChange}
        />
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {teachers.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground" dir="rtl">
                لم يتم العثور على معلمين مطابقين لمعايير البحث
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            )}
          </>
        )}
        
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                // Only show a few page numbers around the current page
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <PaginationItem key={pageNumber}>...</PaginationItem>;
                }
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Layout>
  );
};

export default TeachersPage;
