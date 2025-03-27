import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  FileUp, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  Image, 
  Upload 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchHomePageContent, 
  updateHomePageContent,
  fetchFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ
} from '@/services/api/adminService';

export default function ContentManagement() {
  return (
    <Tabs defaultValue="homepage" className="w-full">
      <TabsList className="mb-6 w-full">
        <TabsTrigger value="homepage" className="flex-1">الصفحة الرئيسية</TabsTrigger>
        <TabsTrigger value="faqs" className="flex-1">الأسئلة الشائعة</TabsTrigger>
      </TabsList>
      
      <TabsContent value="homepage">
        <HomepageContent />
      </TabsContent>
      
      <TabsContent value="faqs">
        <FAQsContent />
      </TabsContent>
    </Tabs>
  );
}

function HomepageContent() {
  const [showEditHero, setShowEditHero] = useState(false);
  const [showEditAbout, setShowEditAbout] = useState(false);
  const [showEditFeatures, setShowEditFeatures] = useState(false);
  const [heroContent, setHeroContent] = useState(null);
  const [aboutContent, setAboutContent] = useState(null);
  const [featuresContent, setFeaturesContent] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const { data: content, isLoading, refetch } = useQuery({
    queryKey: ['homePageContent'],
    queryFn: fetchHomePageContent,
  });

  useEffect(() => {
    if (content) {
      setHeroContent(content.hero);
      setAboutContent(content.about);
      setFeaturesContent(content.features);
    }
  }, [content]);

  const handleSaveHero = async () => {
    setIsUploading(true);
    try {
      await updateHomePageContent('hero', heroContent);
      toast({
        title: "تم التحديث",
        description: "تم تحديث محتوى القسم الرئيسي بنجاح",
      });
      refetch();
      setShowEditHero(false);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث المحتوى. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAbout = async () => {
    setIsUploading(true);
    try {
      await updateHomePageContent('about', aboutContent);
      toast({
        title: "تم التحديث",
        description: "تم تحديث محتوى قسم عن المنصة بنجاح",
      });
      refetch();
      setShowEditAbout(false);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث المحتوى. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveFeatures = async () => {
    setIsUploading(true);
    try {
      await updateHomePageContent('features', featuresContent);
      toast({
        title: "تم التحديث",
        description: "تم تحديث محتوى قسم المميزات بنجاح",
      });
      refetch();
      setShowEditFeatures(false);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث المحتوى. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (section, field, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      
      switch (section) {
        case 'hero':
          setHeroContent({ ...heroContent, [field]: base64 });
          break;
        case 'about':
          setAboutContent({ ...aboutContent, [field]: base64 });
          break;
        case 'features':
          setFeaturesContent({ ...featuresContent, [field]: base64 });
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>القسم الرئيسي</CardTitle>
              <CardDescription>قسم الترحيب في الصفحة الرئيسية</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEditHero(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">العنوان الرئيسي</h3>
              <p className="text-sm text-muted-foreground">{content?.hero?.title}</p>
              
              <h3 className="font-medium mt-4 mb-1">الوصف</h3>
              <p className="text-sm text-muted-foreground">{content?.hero?.description}</p>
              
              <h3 className="font-medium mt-4 mb-1">نص الزر</h3>
              <p className="text-sm text-muted-foreground">{content?.hero?.buttonText}</p>
            </div>
            <div className="flex justify-center items-center">
              {content?.hero?.imageUrl && (
                <img 
                  src={content.hero.imageUrl} 
                  alt="Hero Section" 
                  className="max-h-40 rounded-md object-cover" 
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>قسم عن المنصة</CardTitle>
              <CardDescription>معلومات حول المنصة والخدمات</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEditAbout(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-1">العنوان</h3>
              <p className="text-sm text-muted-foreground">{content?.about?.title}</p>
              
              <h3 className="font-medium mt-4 mb-1">الوصف</h3>
              <p className="text-sm text-muted-foreground">{content?.about?.description}</p>
            </div>
            <div className="flex justify-center items-center">
              {content?.about?.imageUrl && (
                <img 
                  src={content.about.imageUrl} 
                  alt="About Section" 
                  className="max-h-40 rounded-md object-cover" 
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>قسم المميزات</CardTitle>
              <CardDescription>مميزات المنصة والخدمات المقدمة</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEditFeatures(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="font-medium mb-1">العنوان</h3>
            <p className="text-sm text-muted-foreground">{content?.features?.title}</p>
            
            <h3 className="font-medium mt-4 mb-1">المميزات</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content?.features?.items?.map((feature, index) => (
                <div key={index} className="border rounded-md p-3">
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditHero} onOpenChange={setShowEditHero}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل القسم الرئيسي</DialogTitle>
            <DialogDescription>
              تعديل محتوى قسم الترحيب في الصفحة الرئيسية
            </DialogDescription>
          </DialogHeader>
          {heroContent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hero-title">العنوان الرئيسي</Label>
                <Input 
                  id="hero-title" 
                  value={heroContent.title} 
                  onChange={(e) => setHeroContent({...heroContent, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">الوصف</Label>
                <Textarea 
                  id="hero-description" 
                  rows={4}
                  value={heroContent.description} 
                  onChange={(e) => setHeroContent({...heroContent, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-button">نص الزر</Label>
                <Input 
                  id="hero-button" 
                  value={heroContent.buttonText} 
                  onChange={(e) => setHeroContent({...heroContent, buttonText: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-image">الصورة</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center h-40 border rounded-md overflow-hidden bg-muted">
                    {heroContent.imageUrl ? (
                      <img 
                        src={heroContent.imageUrl} 
                        alt="Hero Preview" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>لا توجد صورة</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <Label htmlFor="hero-image-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center px-4 py-2 border border-dashed rounded-md">
                        <Upload className="h-5 w-5 mr-2" />
                        <span>اختر صورة جديدة</span>
                      </div>
                      <input
                        id="hero-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('hero', 'imageUrl', e)}
                      />
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditHero(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveHero} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جارِ الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditAbout} onOpenChange={setShowEditAbout}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل قسم عن المنصة</DialogTitle>
            <DialogDescription>
              تعديل محتوى قسم معلومات المنصة
            </DialogDescription>
          </DialogHeader>
          {aboutContent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">العنوان</Label>
                <Input 
                  id="about-title" 
                  value={aboutContent.title} 
                  onChange={(e) => setAboutContent({...aboutContent, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-description">الوصف</Label>
                <Textarea 
                  id="about-description" 
                  rows={4}
                  value={aboutContent.description} 
                  onChange={(e) => setAboutContent({...aboutContent, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-image">الصورة</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center h-40 border rounded-md overflow-hidden bg-muted">
                    {aboutContent.imageUrl ? (
                      <img 
                        src={aboutContent.imageUrl} 
                        alt="About Preview" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>لا توجد صورة</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <Label htmlFor="about-image-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center px-4 py-2 border border-dashed rounded-md">
                        <Upload className="h-5 w-5 mr-2" />
                        <span>اختر صورة جديدة</span>
                      </div>
                      <input
                        id="about-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('about', 'imageUrl', e)}
                      />
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditAbout(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveAbout} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جارِ الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditFeatures} onOpenChange={setShowEditFeatures}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل قسم المميزات</DialogTitle>
            <DialogDescription>
              تعديل محتوى قسم مميزات المنصة
            </DialogDescription>
          </DialogHeader>
          {featuresContent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="features-title">العنوان</Label>
                <Input 
                  id="features-title" 
                  value={featuresContent.title} 
                  onChange={(e) => setFeaturesContent({...featuresContent, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Label>المميزات</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const newItems = [...(featuresContent.items || []), { title: '', description: '' }];
                      setFeaturesContent({...featuresContent, items: newItems});
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة ميزة
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {featuresContent.items?.map((item, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">ميزة {index + 1}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const newItems = [...featuresContent.items];
                              newItems.splice(index, 1);
                              setFeaturesContent({...featuresContent, items: newItems});
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`feature-${index}-title`}>عنوان الميزة</Label>
                            <Input 
                              id={`feature-${index}-title`}
                              value={item.title} 
                              onChange={(e) => {
                                const newItems = [...featuresContent.items];
                                newItems[index].title = e.target.value;
                                setFeaturesContent({...featuresContent, items: newItems});
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`feature-${index}-description`}>وصف الميزة</Label>
                            <Textarea 
                              id={`feature-${index}-description`}
                              rows={2}
                              value={item.description} 
                              onChange={(e) => {
                                const newItems = [...featuresContent.items];
                                newItems[index].description = e.target.value;
                                setFeaturesContent({...featuresContent, items: newItems});
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFeatures(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveFeatures} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جارِ الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FAQsContent() {
  const [showAddFAQ, setShowAddFAQ] = useState(false);
  const [showEditFAQ, setShowEditFAQ] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [faqData, setFaqData] = useState({ question: '', answer: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: faqs = [], refetch } = useQuery({
    queryKey: ['adminFAQs'],
    queryFn: fetchFAQs,
  });

  const handleAddFAQ = async () => {
    if (!faqData.question || !faqData.answer) {
      toast({
        title: "حقول فارغة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addFAQ(faqData);
      toast({
        title: "تمت الإضافة",
        description: "تمت إضافة السؤال الشائع بنجاح",
      });
      refetch();
      setShowAddFAQ(false);
      setFaqData({ question: '', answer: '' });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة السؤال الشائع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFAQ = async () => {
    if (!selectedFAQ.question || !selectedFAQ.answer) {
      toast({
        title: "حقول فارغة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateFAQ(selectedFAQ.id, selectedFAQ);
      toast({
        title: "تم التحديث",
        description: "تم تحديث السؤال الشائع بنجاح",
      });
      refetch();
      setShowEditFAQ(false);
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث السؤال الشائع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا السؤال الشائع؟')) return;
    
    try {
      await deleteFAQ(id);
      toast({
        title: "تم الحذف",
        description: "تم حذف السؤال الشائع بنجاح",
      });
      refetch();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حذف السؤال الشائع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">الأسئلة الشائعة</h2>
        <Button onClick={() => setShowAddFAQ(true)}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة سؤال جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {faqs.length === 0 ? (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground">لا توجد أسئلة شائعة حالياً</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <Card key={faq.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setSelectedFAQ(faq);
                        setShowEditFAQ(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteFAQ(faq.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showAddFAQ} onOpenChange={setShowAddFAQ}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>إضافة سؤال شائع جديد</DialogTitle>
            <DialogDescription>
              أضف سؤالاً وإجابته ليظهر في صفحة الأسئلة الشائعة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">السؤال</Label>
              <Input 
                id="faq-question" 
                value={faqData.question} 
                onChange={(e) => setFaqData({...faqData, question: e.target.value})}
                placeholder="أدخل السؤال هنا"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">الإجابة</Label>
              <Textarea 
                id="faq-answer" 
                rows={4}
                value={faqData.answer} 
                onChange={(e) => setFaqData({...faqData, answer: e.target.value})}
                placeholder="أدخل الإجابة هنا"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFAQ(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddFAQ} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جارِ الإضافة...
                </>
              ) : (
                'إضافة'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditFAQ} onOpenChange={setShowEditFAQ}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تعديل سؤال شائع</DialogTitle>
            <DialogDescription>
              تعديل السؤال والإجابة
            </DialogDescription>
          </DialogHeader>
          {selectedFAQ && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-faq-question">السؤال</Label>
                <Input 
                  id="edit-faq-question" 
                  value={selectedFAQ.question} 
                  onChange={(e) => setSelectedFAQ({...selectedFAQ, question: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-faq-answer">الإجابة</Label>
                <Textarea 
                  id="edit-faq-answer" 
                  rows={4}
                  value={selectedFAQ.answer} 
                  onChange={(e) => setSelectedFAQ({...selectedFAQ, answer: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFAQ(false)}>
              إلغاء
            </Button>
            <Button onClick={handleEditFAQ} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  جارِ الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
