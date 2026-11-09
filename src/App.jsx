import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero.jsx';
import GeneratorSection from './components/sections/GeneratorSection.jsx';
import HowItWorks from './components/sections/HowItWorks.jsx';

export default function App() {
  return (
    <>
      <a href="#generator" className="skip-link">
        Skip to QR generator
      </a>
      <Navbar />
      <main>
        <Hero />
        <GeneratorSection />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
