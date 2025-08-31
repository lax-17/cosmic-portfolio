import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Award, Calendar, MapPin, Star, Trophy, BookOpen } from "lucide-react";

const EducationSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const education = [
    {
      degree: "MSc in Artificial Intelligence",
      institution: "Sheffield Hallam University",
      location: "Sheffield, UK",
      period: "2025 – 2026",
      status: "In Progress",
      description: "Advanced studies in AI/ML with focus on deep learning, neural networks, and practical applications.",
      highlights: [
        "Advanced Machine Learning",
        "Deep Learning Architectures",
        "Natural Language Processing",
        "Computer Vision",
        "AI Ethics & Safety"
      ]
    },
    {
      degree: "BSc in Information Technology and Mathematics",
      institution: "Ufa University of Science and Technology",
      location: "Sterlitamak, Russia",
      period: "Sep 2019 – Jul 2023",
      status: "Completed",
      grade: "Distinction (GPA: 4.77/5)",
      description: "Comprehensive program combining theoretical mathematics with practical IT skills, graduating with distinction.",
      highlights: [
        "Mathematical Foundations",
        "Software Engineering",
        "Data Structures & Algorithms",
        "Database Systems",
        "Statistical Analysis"
      ]
    }
  ];

  const certifications = [
    {
      title: "Neural Networks & Deep Learning",
      issuer: "DeepLearning.AI",
      year: "2023",
      category: "Deep Learning",
      description: "Comprehensive course covering neural network fundamentals and deep learning principles.",
      skills: ["Neural Networks", "Backpropagation", "Deep Learning", "Python"]
    },
    {
      title: "Improving Deep Neural Networks",
      issuer: "DeepLearning.AI",
      year: "2023",
      category: "Deep Learning",
      description: "Advanced techniques for optimizing and improving deep neural network performance.",
      skills: ["Hyperparameter Tuning", "Regularization", "Optimization", "Batch Normalization"]
    },
    {
      title: "Convolutional Neural Networks",
      issuer: "DeepLearning.AI",
      year: "2023",
      category: "Computer Vision",
      description: "Specialized training in CNN architectures for computer vision applications.",
      skills: ["CNNs", "Computer Vision", "Image Processing", "Transfer Learning"]
    },
    {
      title: "Machine Learning Specialization",
      issuer: "Kaggle",
      year: "2023",
      category: "Machine Learning",
      description: "Comprehensive ML training including intro to ML, intermediate ML, and data visualization.",
      skills: ["Supervised Learning", "Unsupervised Learning", "Data Visualization", "Feature Engineering"]
    },
    {
      title: "365 Data Science Bootcamp",
      issuer: "365 Data Science",
      year: "2022",
      category: "Data Science",
      description: "Intensive bootcamp covering full data science pipeline from statistics to deployment.",
      skills: ["Statistics", "Python", "SQL", "Data Analysis", "Machine Learning"]
    },
    {
      title: "MongoDB Basics (M001)",
      issuer: "MongoDB",
      year: "2021",
      category: "Database",
      description: "Fundamentals of MongoDB database design and operations.",
      skills: ["NoSQL", "MongoDB", "Database Design", "Aggregation"]
    }
  ];

  const awards = [
    {
      title: "Transform Together Scholarship",
      description: "Awarded for academic excellence and leadership potential",
      year: "2025",
      type: "Scholarship"
    },
    {
      title: "Academic Excellence Award (Distinction)",
      description: "Top performance in BSc IT & Mathematics program",
      year: "2023",
      type: "Academic"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Deep Learning": "hsl(272, 91%, 60%)",
      "Computer Vision": "hsl(261, 43%, 60%)",
      "Machine Learning": "hsl(214, 71%, 60%)",
      "Data Science": "hsl(224, 47%, 60%)",
      "Database": "hsl(142, 71%, 45%)"
    };
    return colors[category] || "hsl(224, 47%, 60%)";
  };

  return (
    <section id="education" className="min-h-screen flex items-center py-20 scroll-mt-20">
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
            Education & Certifications
          </motion.h2>

          {/* Education Section */}
          <div className="mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl font-bold text-cosmic mb-8 flex items-center gap-3"
            >
              <GraduationCap className="text-primary" size={28} />
              Education
            </motion.h3>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-cosmic">{edu.degree}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          edu.status === 'Completed' 
                            ? 'bg-green-500/20 text-green-600' 
                            : 'bg-blue-500/20 text-blue-600'
                        }`}>
                          {edu.status}
                        </span>
                      </div>
                      <div className="text-primary font-semibold mb-2">{edu.institution}</div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {edu.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {edu.period}
                        </span>
                        {edu.grade && (
                          <span className="flex items-center gap-1">
                            <Star size={14} />
                            {edu.grade}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{edu.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {edu.highlights.map((highlight, hIndex) => (
                      <span
                        key={hIndex}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-2xl font-bold text-cosmic mb-8 flex items-center gap-3"
            >
              <Award className="text-primary" size={28} />
              Professional Certifications
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                  whileHover={{ y: -5, rotateY: 5, scale: 1.02 }}
                  className="glass-card p-6 group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(cert.category) }}
                    ></div>
                    <span className="text-xs text-muted-foreground">{cert.year}</span>
                  </div>

                  <h4 className="text-lg font-bold text-cosmic mb-2 group-hover:text-primary transition-colors">
                    {cert.title}
                  </h4>
                  
                  <div className="text-primary font-medium mb-2">{cert.issuer}</div>
                  
                  <div className="inline-block px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground mb-3">
                    {cert.category}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {cert.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, sIndex) => (
                      <span
                        key={sIndex}
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Awards Section */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-2xl font-bold text-cosmic mb-8 flex items-center gap-3"
            >
              <Trophy className="text-primary" size={28} />
              Honors & Awards
            </motion.h3>

            <div className="grid md:grid-cols-2 gap-6">
              {awards.map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Trophy className="text-yellow-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-cosmic">{award.title}</h4>
                        <span className="text-sm text-muted-foreground">{award.year}</span>
                      </div>
                      <div className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs mb-2">
                        {award.type}
                      </div>
                      <p className="text-muted-foreground">{award.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="glass-card p-8 mt-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{education.length}</div>
                <div className="text-sm text-muted-foreground">Degrees</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{certifications.length}</div>
                <div className="text-sm text-muted-foreground">Certifications</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{awards.length}</div>
                <div className="text-sm text-muted-foreground">Awards</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">4.77/5</div>
                <div className="text-sm text-muted-foreground">GPA</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;