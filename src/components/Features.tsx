
import { motion } from 'framer-motion';
import { School, Video, CalendarDays, Shield, CreditCard, BookOpen } from 'lucide-react';

const features = [
  {
    title: 'معلمون محترفون',
    description: 'تعلم مع معلمين كوريين محترفين أو معلمين ثنائيي اللغة.',
    icon: School,
  },
  {
    title: 'دروس مباشرة',
    description: 'جلسات فيديو عالية الجودة مع ميزات تعليمية تفاعلية.',
    icon: Video,
  },
  {
    title: 'مواعيد مرنة',
    description: 'اختر الأوقات التي تناسبك واحجز دروسك بسهولة.',
    icon: CalendarDays,
  },
  {
    title: 'خصوصية وأمان',
    description: 'محادثات ودروس آمنة ومشفرة لحماية خصوصيتك.',
    icon: Shield,
  },
  {
    title: 'نظام دفع سهل',
    description: 'محفظة إلكترونية وطرق دفع متعددة بالريال السعودي.',
    icon: CreditCard,
  },
  {
    title: 'مناهج مخصصة',
    description: 'دروس مصممة حسب مستواك واحتياجاتك التعليمية.',
    icon: BookOpen,
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-background" dir="rtl" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            مميزات منصة هانجوك
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            توفر منصتنا العديد من المميزات لمساعدتك على تعلم اللغة الكورية بكفاءة وسهولة
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-md transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
