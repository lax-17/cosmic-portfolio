import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, Clock, Eye, ArrowRight, Tag, User, BookOpen, TrendingUp } from "lucide-react";
import { useState } from "react";

const BlogSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const blogPosts = [
    {
      id: 1,
      title: "Fine-tuning Llama 3 8B for Healthcare Applications: A Complete Guide",
      excerpt: "Deep dive into the process of fine-tuning large language models for clinical narratives, including data preparation, QLoRA implementation, and evaluation strategies.",
      content: "In this comprehensive guide, I'll walk you through the entire process of fine-tuning Llama 3 8B for healthcare applications. We'll cover everything from synthetic data generation to deployment strategies...",
      category: "LLM Fine-tuning",
      readTime: "12 min read",
      publishDate: "2025-01-15",
      views: 2847,
      featured: true,
      tags: ["Llama 3", "QLoRA", "Healthcare AI", "Fine-tuning", "PyTorch"],
      image: "/api/placeholder/600/300"
    },
    {
      id: 2,
      title: "Multi-modal Transformers: Fusing Vision and Language for Better AI",
      excerpt: "Exploring the architecture and implementation of hybrid Conv1D + Transformer models that combine DINOv2 embeddings with MediaPipe features.",
      content: "Multi-modal AI systems represent the next frontier in artificial intelligence. In this article, I'll share my experience building a hybrid architecture that achieved 0.350 macro-F1 on a challenging 7-class dataset...",
      category: "Computer Vision",
      readTime: "8 min read",
      publishDate: "2025-01-08",
      views: 1923,
      featured: true,
      tags: ["Transformers", "DINOv2", "MediaPipe", "Multi-modal", "Computer Vision"],
      image: "/api/placeholder/600/300"
    },
    {
      id: 3,
      title: "Building Production-Ready AI Systems: Lessons from Real-World Deployments",
      excerpt: "Key insights and best practices for deploying AI models in production environments, including Docker containerization and offline inference strategies.",
      content: "Deploying AI models in production is vastly different from research environments. Here are the hard-learned lessons from building and deploying multiple AI systems...",
      category: "MLOps",
      readTime: "10 min read",
      publishDate: "2024-12-22",
      views: 3156,
      featured: false,
      tags: ["MLOps", "Docker", "Deployment", "Production AI", "llama.cpp"],
      image: "/api/placeholder/600/300"
    },
    {
      id: 4,
      title: "The Future of GANs in Medical Imaging: fMRI Reconstruction Insights",
      excerpt: "Analyzing the potential and challenges of using StyleGAN2 and U-Net architectures for brain imaging reconstruction tasks.",
      content: "Medical imaging reconstruction using GANs presents unique challenges and opportunities. In this post, I'll share insights from my work on fMRI reconstruction...",
      category: "Medical AI",
      readTime: "15 min read",
      publishDate: "2024-12-10",
      views: 1654,
      featured: false,
      tags: ["GANs", "StyleGAN2", "Medical Imaging", "fMRI", "U-Net"],
      image: "/api/placeholder/600/300"
    },
    {
      id: 5,
      title: "Real-time Object Tracking for Autonomous Systems",
      excerpt: "Implementing robust object tracking algorithms with PID control for drone navigation systems, including GPS and vision fusion techniques.",
      content: "Autonomous systems require robust tracking capabilities. Here's how I built a real-time object tracking system for drone navigation with GPS and vision fusion...",
      category: "Robotics",
      readTime: "11 min read",
      publishDate: "2024-11-28",
      views: 2234,
      featured: false,
      tags: ["Object Tracking", "OpenCV", "PID Control", "Drone Navigation", "Sensor Fusion"],
      image: "/api/placeholder/600/300"
    },
    {
      id: 6,
      title: "Understanding Transformer Attention Mechanisms in Practice",
      excerpt: "A practical guide to implementing and visualizing attention mechanisms in transformer architectures for better model interpretability.",
      content: "Attention mechanisms are the heart of transformer models. Let's dive deep into how they work and how to implement them effectively...",
      category: "Deep Learning",
      readTime: "9 min read",
      publishDate: "2024-11-15",
      views: 1876,
      featured: false,
      tags: ["Transformers", "Attention", "Deep Learning", "Interpretability", "NLP"],
      image: "/api/placeholder/600/300"
    }
  ];

  const categories = [...new Set(blogPosts.map(post => post.category))];
  
  const filteredPosts = selectedCategory 
    ? blogPosts.filter(post => post.category === selectedCategory)
    : blogPosts;

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <section id="blog" className="min-h-screen flex items-center py-20 scroll-mt-20">
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
            Latest Articles & Insights
          </motion.h2>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-glass text-foreground hover:bg-primary/10"
              }`}
            >
              All Articles
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-glass text-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Featured Posts */}
          {!selectedCategory && (
            <div className="mb-16">
              <motion.h3
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-2xl font-bold text-cosmic mb-8 flex items-center gap-3"
              >
                <TrendingUp className="text-primary" size={28} />
                Featured Articles
              </motion.h3>

              <div className="grid lg:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                    className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-primary opacity-50" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(post.publishDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={14} />
                          {post.views.toLocaleString()}
                        </span>
                      </div>

                      <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-xs mb-3">
                        {post.category}
                      </div>

                      <h3 className="text-xl font-bold text-cosmic mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <button className="flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-medium">
                        Read More
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {/* All Posts Grid */}
          <div className="mb-12">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-2xl font-bold text-cosmic mb-8 flex items-center gap-3"
            >
              <BookOpen className="text-primary" size={28} />
              {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
            </motion.h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5, rotateY: 5, scale: 1.02 }}
                  className="glass-card overflow-hidden group cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary opacity-50" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                        {post.category}
                      </span>
                      {post.featured && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-cosmic mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {post.views}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button className="flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 text-sm font-medium">
                      Read Article
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Blog Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="glass-card p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{blogPosts.length}</div>
                <div className="text-sm text-muted-foreground">Articles Published</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {Math.round(blogPosts.reduce((acc, post) => acc + post.views, 0) / 1000)}K
                </div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {Math.round(blogPosts.reduce((acc, post) => acc + parseInt(post.readTime), 0) / blogPosts.length)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Read Time (min)</div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-muted-foreground mb-6">
              Want to stay updated with my latest insights on AI/ML?
            </p>
            <button className="glass-card px-8 py-3 text-cosmic font-semibold hover:scale-105 transition-all duration-300">
              Follow My Work
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;