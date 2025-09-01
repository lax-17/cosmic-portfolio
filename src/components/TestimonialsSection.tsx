import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote, Star, Linkedin, Building, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const TestimonialsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      role: "Senior Clinical Researcher",
      company: "Sheffield Hallam University",
      image: "/api/placeholder/80/80",
      rating: 5,
      testimonial: "Laxmikant's work on the clinical narrative assistant was exceptional. His ability to understand complex medical requirements and translate them into a working AI system was impressive. The 600+ validated clinical profiles he generated were of outstanding quality and directly contributed to our research goals.",
      project: "Clinical Narrative Assistant",
      relationship: "Research Supervisor",
      linkedin: "https://linkedin.com/in/sarah-mitchell-md"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      role: "Head of AI Research",
      company: "Sheffield Hallam University",
      image: "/api/placeholder/80/80",
      rating: 5,
      testimonial: "Working with Laxmikant on multi-modal transformer research was a pleasure. His innovative approach to fusing DINOv2 embeddings with MediaPipe features resulted in a 40% improvement over existing baselines. His technical depth and research methodology are truly commendable.",
      project: "Multi-modal Transformers",
      relationship: "Research Collaborator",
      linkedin: "https://linkedin.com/in/prof-michael-chen"
    },
    {
      id: 3,
      name: "Rajesh Patel",
      role: "CTO",
      company: "Tan Theta Software Studio",
      image: "/api/placeholder/80/80",
      rating: 5,
      testimonial: "During his internship, Laxmikant demonstrated exceptional problem-solving skills and technical expertise. He built robust SQL schemas and automated data pipelines that significantly improved our blockchain application's performance. His work ethic and attention to detail were outstanding.",
      project: "Blockchain Data Pipeline",
      relationship: "Former Supervisor",
      linkedin: "https://linkedin.com/in/rajesh-patel-cto"
    },
    {
      id: 4,
      name: "Dr. Emily Rodriguez",
      role: "Medical AI Consultant",
      company: "NHS Digital",
      image: "/api/placeholder/80/80",
      rating: 5,
      testimonial: "Laxmikant's healthcare AI system impressed our clinical validation team. His attention to safety measures, hallucination checks, and schema-faithful outputs demonstrated a deep understanding of medical AI requirements. The offline deployment capability was exactly what we needed for clinical environments.",
      project: "Healthcare LLM Validation",
      relationship: "Clinical Validator",
      linkedin: "https://linkedin.com/in/emily-rodriguez-md"
    },
    {
      id: 5,
      name: "Alex Thompson",
      role: "Senior ML Engineer",
      company: "DeepMind",
      image: "/api/placeholder/80/80",
      rating: 5,
      testimonial: "I've rarely seen such a comprehensive understanding of both theoretical concepts and practical implementation in a young researcher. Laxmikant's work on GANs for medical imaging reconstruction showed remarkable innovation and technical rigor.",
      project: "fMRI Reconstruction Review",
      relationship: "Industry Reviewer",
      linkedin: "https://linkedin.com/in/alex-thompson-deepmind"
    },
    {
      id: 6,
      name: "Dr. James Wilson",
      role: "Robotics Professor",
      company: "University of Leeds",
      image: "/api/placeholder/80/80",
      rating: 5,
      testimonial: "The drone navigation system Laxmikant developed showcased excellent integration of computer vision with control systems. The real-time tracking at 30 FPS with robust PID control was impressive. His sensor fusion approach for handling GPS and vision data was particularly well-executed.",
      project: "Autonomous Systems Consultation",
      relationship: "Technical Advisor",
      linkedin: "https://linkedin.com/in/james-wilson-robotics"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}
      />
    ));
  };

  return (
    <section id="testimonials" className="min-h-screen flex items-center py-20 scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-section text-cosmic mb-16 text-center"
          >
            What People Say
          </motion.h2>

          {/* Featured Testimonial Carousel */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-8 md:p-12 relative"
            >
              <div className="absolute top-6 left-6">
                <Quote className="text-primary opacity-20" size={48} />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Testimonial Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start mb-4">
                      {renderStars(testimonials[currentTestimonial].rating)}
                    </div>

                    <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 italic">
                      "{testimonials[currentTestimonial].testimonial}"
                    </blockquote>

                    <div className="space-y-2">
                      <div className="text-xl font-bold text-cosmic">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-primary font-medium">
                        {testimonials[currentTestimonial].role}
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
                        <Building size={16} />
                        <span>{testimonials[currentTestimonial].company}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentTestimonial].relationship} • {testimonials[currentTestimonial].project}
                      </div>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 md:w-16 md:h-16 text-primary opacity-50" />
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 glass-card hover:bg-primary/20 transition-colors rounded-full"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentTestimonial ? 'bg-primary' : 'bg-muted'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-3 glass-card hover:bg-primary/20 transition-colors rounded-full"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* All Testimonials Grid */}
          <div className="mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-2xl font-bold text-cosmic mb-8 text-center"
            >
              All Recommendations
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5, rotateY: 5, scale: 1.02 }}
                  className="glass-card p-6 group cursor-pointer"
                  onClick={() => setCurrentTestimonial(index)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary opacity-50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-cosmic text-sm mb-1 truncate">
                        {testimonial.name}
                      </div>
                      <div className="text-primary text-xs mb-1 truncate">
                        {testimonial.role}
                      </div>
                      <div className="text-muted-foreground text-xs truncate">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex mb-3">
                    {renderStars(testimonial.rating)}
                  </div>

                  <blockquote className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                    "{testimonial.testimonial}"
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {testimonial.project}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(testimonial.linkedin, '_blank');
                      }}
                      className="p-1 hover:bg-primary/20 rounded transition-colors"
                      aria-label="View LinkedIn profile"
                    >
                      <Linkedin size={14} className="text-primary" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonial Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="glass-card p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{testimonials.length}</div>
                <div className="text-sm text-muted-foreground">Recommendations</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {[...new Set(testimonials.map(t => t.company))].length}
                </div>
                <div className="text-sm text-muted-foreground">Organizations</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {[...new Set(testimonials.map(t => t.project))].length}
                </div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-muted-foreground mb-6">
              Ready to work together and create something amazing?
            </p>
            <button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="glass-card px-8 py-3 text-cosmic font-semibold hover:scale-105 transition-all duration-300"
            >
              Let's Connect
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;