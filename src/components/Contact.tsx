
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-20 bg-background" dir="rtl" id="contact">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            تواصل معنا
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            نحن هنا للإجابة على جميع استفساراتك. لا تتردد في التواصل معنا
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">البريد الإلكتروني</h3>
                  <p className="text-muted-foreground">info@hanguk.com</p>
                  <p className="text-muted-foreground">support@hanguk.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">رقم الهاتف</h3>
                  <p className="text-muted-foreground">+966 123 456 789</p>
                  <p className="text-muted-foreground">+966 987 654 321</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">العنوان</h3>
                  <p className="text-muted-foreground">
                    الرياض، المملكة العربية السعودية
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">ساعات العمل</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الأحد - الخميس</span>
                  <span>9:00 ص - 8:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الجمعة</span>
                  <span>2:00 م - 8:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السبت</span>
                  <span>10:00 ص - 6:00 م</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form className="space-y-6 bg-card p-8 rounded-xl border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">الاسم</label>
                  <Input id="name" placeholder="أدخل اسمك" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input id="email" type="email" placeholder="example@example.com" dir="ltr" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">الموضوع</label>
                <Input id="subject" placeholder="أدخل موضوع الرسالة" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">الرسالة</label>
                <Textarea id="message" placeholder="أدخل رسالتك هنا" rows={5} />
              </div>
              
              <Button type="submit" className="w-full">إرسال الرسالة</Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
