import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { HelpCircle, ChevronDown, ChevronUp, Search, Filter, MessageCircle, Clock, MapPin, DollarSign } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const faqs = [
    {
      id: 1,
      category: "General",
      question: "What is your background and expertise?",
      answer: "I'm an Applied AI/ML Engineer with an MSc in Artificial Intelligence from Sheffield Hallam University. I specialize in large language models (LLMs), Transformers, multi-modal systems, and computer vision. My experience includes building end-to-end healthcare LLM applications, fine-tuning models with QLoRA, and creating production-ready AI systems with Docker and offline inference capabilities."
    },
    {
      id: 2,
      category: "Technical",
      question: "What technologies and frameworks do you work with?",
      answer: "I primarily work with PyTorch, Hugging Face Transformers, PEFT, and Accelerate for deep learning. For LLMs, I use Llama 3, Gemini, QLoRA fine-tuning, and RAG integration. In computer vision, I work with DINOv2, ViT, MediaPipe, and OpenCV. For deployment, I use Docker, llama.cpp, CUDA, and Linux environments. I'm also proficient in Python, SQL, and JavaScript."
    },
    {
      id: 3,
      category: "Projects",
      question: "Can you tell me about your most significant project?",
      answer: "My most significant project is the Clinical Narrative Assistant - an end-to-end healthcare LLM system. I built synthetic data generation with 600+ clinician-validated profiles, fine-tuned Llama 3 8B with QLoRA on A100 GPUs, implemented safety checks and schema-faithful JSON outputs, and created a deployment pipeline with Docker and llama.cpp for offline inference in clinical environments."
    },
    {
      id: 4,
      category: "Availability",
      question: "Are you available for new opportunities?",
      answer: "Yes, I'm actively seeking new opportunities in AI/ML engineering roles. I'm particularly interested in positions involving LLM development, multi-modal AI systems, computer vision applications, and production AI deployment. I'm open to both full-time positions and consulting projects, with a preference for remote work or positions in the UK."
    },
    {
      id: 5,
      category: "Technical",
      question: "What's your experience with LLM fine-tuning?",
      answer: "I have extensive experience with LLM fine-tuning, particularly using QLoRA for efficient training. I've fine-tuned Llama 3 8B Instruct with 8192-token context for healthcare applications, implemented parameter-efficient fine-tuning (PEFT) techniques, and created evaluation pipelines with regression testing and safety checks. I'm also experienced with prompt engineering and structured output generation."
    },
    {
      id: 6,
      category: "Collaboration",
      question: "How do you approach collaborative projects?",
      answer: "I believe in clear communication, regular updates, and collaborative problem-solving. In my research projects, I've worked closely with clinical advisors for validation, collaborated with academic teams on multi-modal research, and coordinated industry partnerships. I'm comfortable with agile methodologies, code reviews, and cross-functional team collaboration."
    },
    {
      id: 7,
      category: "Technical",
      question: "What's your experience with computer vision?",
      answer: "I have strong experience in computer vision, including multi-modal transformer architectures that fuse DINOv2 embeddings with MediaPipe features. I've worked on emotion recognition achieving 0.350 macro-F1 on 7-class datasets, real-time object tracking for drone navigation at 30 FPS, and medical imaging reconstruction using GANs."
    },
    {
      id: 8,
      category: "General",
      question: "What makes you different from other AI/ML engineers?",
      answer: "My unique combination of theoretical knowledge and practical implementation sets me apart. I have hands-on experience with cutting-edge research (multi-modal transformers, healthcare LLMs) while also focusing on production-ready solutions (Docker deployment, offline inference, safety measures). My work has been validated by medical professionals and has achieved benchmark-beating results."
    },
    {
      id: 9,
      category: "Availability",
      question: "What type of work arrangements do you prefer?",
      answer: "I'm flexible with work arrangements and open to remote, hybrid, or on-site positions. I'm based in Leeds, UK, but have experience working with international teams. For consulting projects, I can adapt to different time zones and communication preferences. I value clear project scopes, regular check-ins, and collaborative working relationships."
    },
    {
      id: 10,
      category: "Projects",
      question: "How do you ensure AI safety in your projects?",
      answer: "AI safety is a priority in all my projects. In healthcare applications, I implement hallucination checks, safety validation, and schema-faithful outputs. I conduct thorough evaluation with domain experts (like clinicians), implement regression testing, and use techniques like threshold calibration and normalization for robust performance. I also consider ethical implications and bias mitigation in model development."
    },
    {
      id: 11,
      category: "Technical",
      question: "What's your approach to model evaluation and validation?",
      answer: "I use comprehensive evaluation strategies including quantitative metrics (macro-F1, accuracy, precision), qualitative assessment by domain experts, regression testing, and safety validation. For healthcare applications, I ensure clinician validation of outputs. I also implement techniques like EMA, threshold calibration, and light test-time augmentation for robust evaluation."
    },
    {
      id: 12,
      category: "Collaboration",
      question: "How do you handle project timelines and deliverables?",
      answer: "I believe in setting realistic timelines with clear milestones. My projects typically range from 4-6 months for comprehensive systems. I provide regular updates, maintain detailed documentation, and ensure deliverables meet quality standards. I'm experienced with both research timelines and industry deadlines, adapting my approach based on project requirements."
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technical':
        return <HelpCircle className="w-4 h-4" />;
      case 'Projects':
        return <MessageCircle className="w-4 h-4" />;
      case 'Availability':
        return <Clock className="w-4 h-4" />;
      case 'Collaboration':
        return <MapPin className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Technical": "hsl(272, 91%, 60%)",
      "Projects": "hsl(214, 71%, 60%)",
      "Availability": "hsl(142, 71%, 45%)",
      "Collaboration": "hsl(224, 47%, 60%)",
      "General": "hsl(261, 43%, 60%)"
    };
    return colors[category] || "hsl(224, 47%, 60%)";
  };

  return (
    <section id="faq" className="min-h-screen flex items-center py-20 scroll-mt-20">
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
            Frequently Asked Questions
          </motion.h2>

          {/* Search and Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 space-y-4"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-glass border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-glass text-foreground hover:bg-primary/10"
                }`}
              >
                <Filter size={16} />
                All Questions
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-glass text-foreground hover:bg-primary/10"
                  }`}
                >
                  {getCategoryIcon(category)}
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ List */}
          <div className="space-y-4 mb-12">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground mb-2">No questions found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
              </motion.div>
            ) : (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="glass-card overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                  whileHover={{ y: -2 }}
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left hover:bg-muted/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getCategoryColor(faq.category) }}
                          ></div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wide">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-cosmic pr-4">
                          {faq.question}
                        </h3>
                      </div>
                      <div className="flex-shrink-0">
                        {openFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {openFAQ === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="pt-4 border-t border-glass-border">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* FAQ Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="glass-card p-8 mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{faqs.length}</div>
                <div className="text-sm text-muted-foreground">Total Questions</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{filteredFAQs.length}</div>
                <div className="text-sm text-muted-foreground">Filtered Results</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {openFAQ ? '1' : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Currently Open</div>
              </div>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <h3 className="text-xl font-bold text-cosmic mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Don't hesitate to reach out if you need more information or want to discuss a potential collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="glass-card px-6 py-3 text-cosmic font-semibold hover:scale-105 transition-all duration-300"
              >
                Get In Touch
              </button>
              <button
                onClick={() => window.open('mailto:laxmikant.data@gmail.com', '_blank')}
                className="glass-card px-6 py-3 text-primary font-semibold hover:scale-105 transition-all duration-300"
              >
                Send Email
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;