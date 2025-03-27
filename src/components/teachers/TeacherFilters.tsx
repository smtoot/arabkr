
import React, { useState } from 'react';
import { Check, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { TeacherFilters as FilterType, TeacherSpecialty, SortOption } from '@/types/teacher';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Map specialties to Arabic
const specialtyLabels: Record<TeacherSpecialty, string> = {
  'conversation': 'محادثة',
  'grammar': 'قواعد',
  'vocabulary': 'مفردات',
  'reading': 'قراءة',
  'writing': 'كتابة',
  'business_korean': 'كورية الأعمال',
  'exam_preparation': 'تحضير الامتحانات'
};

// Available languages
const availableLanguages = [
  { value: 'العربية', label: 'العربية' },
  { value: 'English', label: 'English' },
  { value: '한국어', label: '한국어 (الكورية)' }
];

// Sort options
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'أعلى تقييمًا' },
  { value: 'price_low', label: 'السعر: من الأقل إلى الأعلى' },
  { value: 'price_high', label: 'السعر: من الأعلى إلى الأقل' },
  { value: 'experience', label: 'الخبرة: من الأعلى إلى الأقل' }
];

interface TeacherFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const TeacherFilters: React.FC<TeacherFiltersProps> = ({
  filters,
  onFiltersChange,
  activeSort,
  onSortChange
}) => {
  const [tempFilters, setTempFilters] = useState<FilterType>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (value: number[]) => {
    setTempFilters({ 
      ...tempFilters, 
      minPrice: value[0], 
      maxPrice: value[1] 
    });
  };

  const handleRatingChange = (value: number[]) => {
    setTempFilters({ 
      ...tempFilters, 
      minRating: value[0]
    });
  };

  const handleSpecialtyToggle = (specialty: TeacherSpecialty) => {
    const specialties = tempFilters.specialties || [];
    const updated = specialties.includes(specialty)
      ? specialties.filter(s => s !== specialty)
      : [...specialties, specialty];
    
    setTempFilters({
      ...tempFilters,
      specialties: updated
    });
  };

  const handleLanguageToggle = (language: string) => {
    const languages = tempFilters.languages || [];
    const updated = languages.includes(language)
      ? languages.filter(l => l !== language)
      : [...languages, language];
    
    setTempFilters({
      ...tempFilters,
      languages: updated
    });
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const resetState: FilterType = {};
    setTempFilters(resetState);
    onFiltersChange(resetState);
    setIsOpen(false);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minRating !== undefined) count++;
    if (filters.specialties && filters.specialties.length > 0) count++;
    if (filters.languages && filters.languages.length > 0) count++;
    return count;
  };

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-2" dir="rtl">
      <div className="flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              تصفية
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto" dir="rtl">
            <SheetHeader>
              <SheetTitle className="text-right">خيارات التصفية</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">نطاق السعر (ر.س/ساعة)</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[tempFilters.minPrice || 50, tempFilters.maxPrice || 300]}
                    min={50}
                    max={300}
                    step={10}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>{tempFilters.minPrice || 50} ر.س</span>
                    <span>{tempFilters.maxPrice || 300} ر.س</span>
                  </div>
                </div>
              </div>
              
              {/* Rating Filter */}
              <div>
                <h3 className="font-medium mb-3">التقييم</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[tempFilters.minRating || 0]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={handleRatingChange}
                  />
                  <div className="flex items-center mt-2 text-sm">
                    <span className="mr-1 text-muted-foreground">من {tempFilters.minRating || 0}</span>
                    <Star className="h-4 w-4 fill-primary text-primary" />
                  </div>
                </div>
              </div>
              
              {/* Specialties */}
              <div>
                <h3 className="font-medium mb-3">التخصصات</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(specialtyLabels).map(([value, label]) => (
                    <Badge
                      key={value}
                      variant={tempFilters.specialties?.includes(value as TeacherSpecialty) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleSpecialtyToggle(value as TeacherSpecialty)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Languages */}
              <div>
                <h3 className="font-medium mb-3">اللغات</h3>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map(({ value, label }) => (
                    <Badge
                      key={value}
                      variant={tempFilters.languages?.includes(value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => handleLanguageToggle(value)}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <SheetFooter className="flex flex-row justify-between mt-6 gap-2">
              <Button variant="outline" onClick={resetFilters} className="flex-1">
                إعادة ضبط
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                تطبيق
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex items-center gap-2 mr-auto">
        <span className="text-sm font-medium">ترتيب:</span>
        <Select value={activeSort} onValueChange={(value) => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر طريقة الترتيب" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TeacherFilters;
