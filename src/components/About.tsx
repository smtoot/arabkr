
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary/50">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary bg-primary/10 rounded-full uppercase">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Less, but better
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              We believe that good design is as little design as possible. Our products are refined, minimal, and focused on what truly matters. We strip away the unnecessary so that the necessary can speak.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Our commitment to minimalism isn't just aesthetic—it's functional. We create products that solve problems in the most elegant and straightforward way possible, with careful attention to every detail.
            </p>
            
            <div className="flex gap-4">
              <motion.div
                className="p-px rounded-full bg-gradient-to-r from-primary/80 to-primary overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <a 
                  href="#contact" 
                  className="block px-8 py-3 font-medium bg-background rounded-full text-primary"
                >
                  Get in Touch
                </a>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-secondary overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-medium text-primary/70">Design Philosophy</p>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-2/3 aspect-[4/3] rounded-2xl bg-primary/5 border border-primary/10 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
