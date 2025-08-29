import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("hero");

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      className="nav-glass"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeSection === item.id
                  ? "text-primary bg-primary/10 shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-glass-hover"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        <motion.a
          href="/Laxmikant_Resume.pdf"
          download="Laxmikant_Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-primary bg-primary/10 hover:bg-primary/20 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Download resume (PDF)"
        >
          <Download size={16} />
          Resume
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Navigation;