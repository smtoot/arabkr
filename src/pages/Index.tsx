
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import About from '@/components/About';
import Contact from '@/components/Contact';

const Index = () => {
  return (
    <Layout>
      <div dir="rtl">
        <Hero />
        <Features />
        <About />
        <Contact />
      </div>
    </Layout>
  );
};

export default Index;
