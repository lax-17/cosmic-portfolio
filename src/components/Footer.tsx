import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/lax-17",
      icon: Github,
      color: "hover:text-gray-300"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/laxmikant-nishad",
      icon: Linkedin,
      color: "hover:text-blue-400"
    },
    {
      name: "Email",
      url: "mailto:laxmikant.data@gmail.com",
      icon: Mail,
      color: "hover:text-red-400"
    }
  ];

  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center md:text-left"
          >
            <p className="text-slate-400 text-sm">
              © {currentYear} Laxmikant Nishad. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Built with <Heart className="inline w-3 h-3 text-red-500 mx-1" /> using React & TypeScript
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <span className="text-slate-400 text-sm mr-2">Connect:</span>
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-400 transition-colors duration-200 ${link.color}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Visit ${link.name}`}
              >
                <link.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap justify-center gap-6 text-xs text-slate-500"
        >
          <a href="/#experience" className="hover:text-slate-300 transition-colors">Experience</a>
          <a href="/#projects" className="hover:text-slate-300 transition-colors">Projects</a>
          <a href="/#skills" className="hover:text-slate-300 transition-colors">Skills</a>
          <a href="/#contact" className="hover:text-slate-300 transition-colors">Contact</a>
          <a href="/lab" className="hover:text-slate-300 transition-colors">Lab</a>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;