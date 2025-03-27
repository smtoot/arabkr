
import React from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { arMA } from 'date-fns/locale';
import { Clock, CalendarIcon, MessageSquare, BookOpen } from 'lucide-react';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useBookingForm } from '@/hooks/useBookingForm';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingSummary from '@/components/booking/BookingSummary';

const BookingPage: React.FC = () => {
  const { id: teacherId } = useParams();
  const {
    lessonTypes,
    selectedDate,
    setSelectedDate,
    availableTimeSlots,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedDuration,
    setSelectedDuration,
    selectedLessonType,
    setSelectedLessonType,
    notes,
    setNotes,
    loading,
    handleSubmit,
    bookingCost,
    teacherName
  } = useBookingForm();

  if (!teacherId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4 text-center" dir="rtl">خطأ: معرف المعلم غير صالح</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <h1 className="text-3xl font-bold mb-2 text-center">حجز درس مع {teacherName}</h1>
        <p className="text-muted-foreground mb-8 text-center">اختر التاريخ والوقت والتفاصيل لحجز درسك</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>حدد تاريخ الدرس</CardTitle>
                <CardDescription>اختر يوم متاح من التقويم</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="mx-auto rounded-md border p-3 pointer-events-auto"
                  locale={arMA}
                  disabled={{
                    before: new Date(),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اختر وقت الدرس</CardTitle>
                <CardDescription>المواعيد المتاحة للتاريخ المحدد</CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSlotPicker
                  timeSlots={availableTimeSlots}
                  selectedTimeSlot={selectedTimeSlot}
                  onSelectTimeSlot={setSelectedTimeSlot}
                  loading={loading}
                  selectedDate={selectedDate}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الدرس</CardTitle>
                <CardDescription>اختر مدة الدرس ونوعه</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <FormLabel>مدة الدرس</FormLabel>
                  <Select value={String(selectedDuration)} onValueChange={(value) => setSelectedDuration(Number(value))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر مدة الدرس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 دقيقة</SelectItem>
                      <SelectItem value="60">60 دقيقة</SelectItem>
                      <SelectItem value="90">90 دقيقة</SelectItem>
                      <SelectItem value="120">120 دقيقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FormLabel>نوع الدرس</FormLabel>
                  <Select value={selectedLessonType} onValueChange={setSelectedLessonType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر نوع الدرس" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessonTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FormLabel>ملاحظات للمعلم (اختياري)</FormLabel>
                  <Textarea
                    placeholder="أخبر المعلم عن اهتماماتك أو أهدافك من هذا الدرس"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              teacherName={teacherName}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              selectedDuration={selectedDuration}
              bookingCost={bookingCost}
              isFormComplete={Boolean(selectedDate && selectedTimeSlot && selectedLessonType)}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
