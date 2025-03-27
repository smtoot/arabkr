
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section className="py-20 bg-muted/30" dir="rtl" id="about">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-6">من نحن</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              هانجوك هي منصة تعليمية متخصصة في تعليم اللغة الكورية للناطقين باللغة العربية. نهدف إلى تقديم تجربة تعليمية فريدة ومخصصة تناسب احتياجات المتعلمين العرب.
            </p>
            <p className="text-muted-foreground mb-6">
              تأسست منصتنا بهدف سد الفجوة في تعليم اللغة الكورية للناطقين بالعربية، حيث نوفر معلمين محترفين يتحدثون العربية والكورية بطلاقة، مما يسهل عملية التعلم ويجعلها أكثر فعالية.
            </p>
            <p className="text-muted-foreground mb-8">
              نؤمن بأن تعلم اللغة يجب أن يكون ممتعًا وسهلًا وفعالًا. لذلك، نقدم مجموعة متنوعة من الدروس والأنشطة التفاعلية التي تساعد الطلاب على اكتساب المهارات اللغوية بسرعة وثقة.
            </p>
            <Link to="/about">
              <Button>تعرف علينا أكثر</Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1548115184-bc6544d06a58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80" 
                alt="الثقافة الكورية" 
                className="rounded-xl shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-background dark:bg-background p-6 rounded-xl shadow-lg hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-background">
                      <span className="text-xs font-semibold">١٠٠+</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-background">
                      <span className="text-xs font-semibold">٩٩%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">أكثر من ١٠٠ معلم محترف</p>
                    <p className="text-xs text-muted-foreground">مع معدل رضا ٩٩%</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
