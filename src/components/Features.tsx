
import { motion } from 'framer-motion';
import { Feather, Award, Sparkles, Layers, Repeat, Shield } from 'lucide-react';

const features = [
  {
    icon: <Feather className="w-6 h-6" />,
    title: 'Lightweight Design',
    description: 'Streamlined interface that focuses on what matters most, eliminating unnecessary elements.'
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Premium Build',
    description: 'Crafted with careful attention to every detail, ensuring lasting quality and performance.'
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Intuitive Experience',
    description: 'Designed to be immediately understandable, without the need for instructions.'
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Advanced Materials',
    description: 'Utilizing the best materials available to create a product that feels as good as it looks.'
  },
  {
    icon: <Repeat className="w-6 h-6" />,
    title: 'Sustainable Approach',
    description: 'Built with recycled materials and designed for longevity to minimize environmental impact.'
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy Focused',
    description: 'Your data stays yours with our commitment to privacy and security at every level.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="content-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-primary bg-primary/10 rounded-full uppercase">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Thoughtfully designed.<br />Meticulously crafted.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature has been designed with purpose and precision, ensuring a seamless and delightful experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col p-6 rounded-2xl border border-border/60 hover:border-primary/20 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="p-3 mb-4 rounded-xl bg-primary/5 w-fit">
                {feature.icon}
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
