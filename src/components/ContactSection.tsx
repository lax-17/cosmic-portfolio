import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Mail, Linkedin, Github, Phone, Copy, ExternalLink, Download } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "laxmikant.data@gmail.com",
      link: "mailto:laxmikant.data@gmail.com",
      copyable: true,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/laxmikant-nishad",
      link: "https://linkedin.com/in/laxmikant-nishad",
      copyable: false,
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/lax-17",
      link: "https://github.com/lax-17",
      copyable: false,
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+44 7470398416",
      link: "tel:+447470398416",
      copyable: true,
    },
  ];

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section id="contact" className="min-h-screen flex items-center py-20 scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-section text-cosmic mb-16 text-center"
          >
            Let's Connect
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Message */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold text-cosmic mb-6">
                Ready to collaborate?
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                I'm always interested in discussing new opportunities, innovative projects, 
                and collaborations in AI/ML. Whether you're looking for a researcher, 
                engineer, or consultant, I'd love to hear from you.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Available for remote opportunities</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Open to consulting projects</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Based in Leeds, UK</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-8"
              >
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <motion.a
                    href="mailto:laxmikant.data@gmail.com"
                    className="inline-flex items-center gap-3 glass-card px-6 py-3 text-cosmic font-semibold hover:scale-105 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail size={20} />
                    Send Message
                  </motion.a>

                  <motion.a
                    href="/Laxmikant_Resume.pdf"
                    download="Laxmikant's Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 glass-card px-6 py-3 text-cosmic font-semibold hover:scale-105 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Download resume as PDF"
                  >
                    <Download size={20} />
                    Download Resume (PDF)
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4"
            >
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                
                return (
                  <motion.div
                    key={contact.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 glass-card rounded-lg group-hover:bg-primary/20 transition-all duration-300">
                          <IconComponent size={24} className="text-primary" />
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {contact.label}
                          </div>
                          <div className="text-foreground font-medium">
                            {contact.value}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {contact.copyable && (
                          <motion.button
                            onClick={() => copyToClipboard(contact.value, contact.label)}
                            className="p-2 glass-card hover:bg-primary/20 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Copy to clipboard"
                          >
                            {copiedField === contact.label ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-xs text-primary font-medium"
                              >
                                ✓
                              </motion.span>
                            ) : (
                              <Copy size={16} className="text-muted-foreground" />
                            )}
                          </motion.button>
                        )}
                        
                        <motion.a
                          href={contact.link}
                          target={contact.link.startsWith('http') ? '_blank' : undefined}
                          rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="p-2 glass-card hover:bg-primary/20 transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Open"
                        >
                          <ExternalLink size={16} className="text-muted-foreground" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center mt-16 pt-8 border-t border-glass-border"
          >
            <p className="text-muted-foreground">
              Built with passion using React, TypeScript, Framer Motion, and Tailwind CSS
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              © 2025 Laxmikant Nishad. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;