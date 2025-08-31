import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { ContactFormValues, contactFormSchema } from "@/lib/contactFormSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, FileText, History, BarChart3, Save, Download, Eye, EyeOff, Settings } from "lucide-react";
import { useEnhancedAnalytics } from "@/hooks/useAnalytics";

const ContactForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formSubmissions, setFormSubmissions] = useState<Array<{
    id: string;
    timestamp: string;
    name: string;
    email: string;
    subject: string;
    status: 'success' | 'error';
  }>>([]);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { trackFormInteraction } = useEnhancedAnalytics();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  // Form templates
  const formTemplates = [
    {
      id: "collaboration",
      name: "Collaboration Inquiry",
      subject: "Collaboration Opportunity",
      message: "Hi! I'm interested in collaborating on a project. I have experience in [your expertise] and would love to discuss potential opportunities to work together.\n\nLooking forward to hearing from you!"
    },
    {
      id: "job-inquiry",
      name: "Job Opportunity",
      subject: "Job Opportunity Discussion",
      message: "Hello! I came across your profile and I'm impressed by your work in [specific area]. I'm currently looking for opportunities in [field/industry] and would like to discuss potential roles or projects.\n\nWould you be available for a conversation?"
    },
    {
      id: "project-feedback",
      name: "Project Feedback",
      subject: "Feedback on Your Work",
      message: "Hi! I recently explored your [specific project] and wanted to share some feedback. I particularly enjoyed [specific aspect] and found [another aspect] very insightful.\n\nGreat work overall!"
    },
    {
      id: "mentorship",
      name: "Mentorship Request",
      subject: "Mentorship Opportunity",
      message: "Hello! I'm currently working on [your current project/goal] and would greatly benefit from your guidance and expertise in [specific area]. Would you be open to a mentorship discussion?\n\nThank you for considering!"
    }
  ];

  // Analytics data
  const analyticsData = useMemo(() => {
    const totalSubmissions = formSubmissions.length;
    const successfulSubmissions = formSubmissions.filter(s => s.status === 'success').length;
    const errorSubmissions = formSubmissions.filter(s => s.status === 'error').length;
    const successRate = totalSubmissions > 0 ? (successfulSubmissions / totalSubmissions * 100).toFixed(1) : '0';

    const recentSubmissions = formSubmissions.slice(-5).reverse();
    const uniqueContacts = new Set(formSubmissions.map(s => s.email)).size;

    return {
      totalSubmissions,
      successfulSubmissions,
      errorSubmissions,
      successRate,
      recentSubmissions,
      uniqueContacts
    };
  }, [formSubmissions]);

  // Load form template
  const loadTemplate = (templateId: string) => {
    const template = formTemplates.find(t => t.id === templateId);
    if (template) {
      form.setValue('subject', template.subject);
      form.setValue('message', template.message);
      setSelectedTemplate(templateId);
      toast.success(`Template "${template.name}" loaded`);
    }
  };

  // Export form submissions
  const exportSubmissions = (format: 'json' | 'csv') => {
    if (formSubmissions.length === 0) {
      toast.error("No submissions to export");
      return;
    }

    const exportData = formSubmissions.map(submission => ({
      id: submission.id,
      timestamp: submission.timestamp,
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      status: submission.status
    }));

    if (format === 'json') {
      const dataStr = JSON.stringify({
        submissions: exportData,
        metadata: {
          totalSubmissions: exportData.length,
          successRate: analyticsData.successRate,
          exportDate: new Date().toISOString()
        }
      }, null, 2);

      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contact-form-submissions.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvHeaders = 'ID,Timestamp,Name,Email,Subject,Status\n';
      const csvRows = exportData.map(submission =>
        `"${submission.id}","${submission.timestamp}","${submission.name}","${submission.email}","${submission.subject}","${submission.status}"`
      ).join('\n');

      const csv = csvHeaders + csvRows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contact-form-submissions.csv';
      a.click();
      URL.revokeObjectURL(url);
    }

    toast.success(`Exported ${exportData.length} submissions`);
  };

  // Rate limiting - 5 minutes between submissions
  const canSubmit = () => {
    const now = Date.now();
    const timeDiff = now - lastSubmitTime;
    return timeDiff > 5 * 60 * 1000; // 5 minutes in milliseconds
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  };

  const onSubmit = async (data: ContactFormValues) => {
    // Check honeypot field for spam
    if (data.honeypot) {
      toast.error("Spam detected");
      return;
    }

    // Check rate limiting
    if (!canSubmit()) {
      toast.error("Please wait before sending another message");
      return;
    }

    // Track form submission
    trackFormInteraction('contact_form', 'submit');
    
    setIsSubmitting(true);
    
    try {
      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        subject: sanitizeInput(data.subject),
        message: sanitizeInput(data.message),
      };

      // Initialize EmailJS with public key from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS environment variables are not set");
      }

      // Send email using EmailJS
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: sanitizedData.name,
          from_email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
        },
        publicKey
      );

      if (result.status === 200) {
        // Update last submit time
        setLastSubmitTime(Date.now());

        // Track successful submission
        trackFormInteraction('contact_form', 'success');

        // Add to submission history
        const newSubmission = {
          id: `submission_${Date.now()}`,
          timestamp: new Date().toISOString(),
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: sanitizedData.subject,
          status: 'success' as const
        };
        setFormSubmissions(prev => [newSubmission, ...prev]);

        toast.success("Message sent successfully!");
        form.reset();
        setSelectedTemplate(null);

        // Redirect to success page
        setTimeout(() => {
          navigate('/contact-success');
        }, 1000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Track form error
      trackFormInteraction('contact_form', 'error');

      // Add failed submission to history
      const failedSubmission = {
        id: `submission_${Date.now()}`,
        timestamp: new Date().toISOString(),
        name: data.name,
        email: data.email,
        subject: data.subject,
        status: 'error' as const
      };
      setFormSubmissions(prev => [failedSubmission, ...prev]);

      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Controls Bar */}
      <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg cosmic-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTemplates(!showTemplates)}
          className={`text-xs ${showTemplates ? 'bg-primary/20' : ''}`}
        >
          <FileText className="w-4 h-4 mr-1" />
          Templates
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className={`text-xs ${showAnalytics ? 'bg-primary/20' : ''}`}
        >
          <BarChart3 className="w-4 h-4 mr-1" />
          Analytics
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
          className={`text-xs ${showHistory ? 'bg-primary/20' : ''}`}
        >
          <History className="w-4 h-4 mr-1" />
          History ({formSubmissions.length})
        </Button>
        {formSubmissions.length > 0 && (
          <>
            <div className="w-px h-6 bg-border mx-2"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportSubmissions('json')}
              className="text-xs"
            >
              <Download className="w-4 h-4 mr-1" />
              Export JSON
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportSubmissions('csv')}
              className="text-xs"
            >
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </>
        )}
      </div>

      {/* Templates Panel */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="terminal-panel"
          >
            <div className="terminal-header">
              <span className="text-xs">form_templates.md</span>
            </div>
            <div className="terminal-content">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">// Choose a template to get started</div>
                <div className="grid gap-2">
                  {formTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => loadTemplate(template.id)}
                      className={`p-3 text-left rounded-lg border transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{template.subject}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="terminal-panel"
          >
            <div className="terminal-header">
              <span className="text-xs">form_analytics.json</span>
            </div>
            <div className="terminal-content">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{analyticsData.totalSubmissions}</div>
                  <div className="text-xs text-muted-foreground">Total Submissions</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">{analyticsData.successfulSubmissions}</div>
                  <div className="text-xs text-muted-foreground">Successful</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-red-600">{analyticsData.errorSubmissions}</div>
                  <div className="text-xs text-muted-foreground">Errors</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">{analyticsData.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
              </div>
              {analyticsData.uniqueContacts > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">// Additional Stats</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Unique Contacts: <span className="font-medium">{analyticsData.uniqueContacts}</span></div>
                    <div>Last Submission: <span className="font-medium">
                      {formSubmissions.length > 0 ? new Date(formSubmissions[0].timestamp).toLocaleDateString() : 'None'}
                    </span></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="terminal-panel"
          >
            <div className="terminal-header">
              <span className="text-xs">submission_history.log</span>
            </div>
            <div className="terminal-content">
              {formSubmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet</p>
                  <p className="text-sm">Form submissions will appear here</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analyticsData.recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            submission.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          <span className="font-medium text-sm">{submission.name}</span>
                          <span className="text-xs text-muted-foreground">({submission.email})</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{submission.subject}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(submission.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="terminal-panel"
      >
        <div className="terminal-header">
          <div className="flex gap-2" aria-label="Terminal window controls">
            <div className="terminal-dot bg-red-500" aria-label="Close terminal"></div>
            <div className="terminal-dot bg-yellow-500" aria-label="Minimize terminal"></div>
            <div className="terminal-dot bg-green-500" aria-label="Maximize terminal"></div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span aria-hidden="true">contact_form.sh</span>
            {selectedTemplate && (
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                {formTemplates.find(t => t.id === selectedTemplate)?.name}
              </span>
            )}
          </div>
        </div>

        <div className="terminal-content">
          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Honeypot field for spam protection - hidden from users */}
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="honeypot"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          ref={honeypotRef}
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm text-terminal-text">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        className="border-terminal-border bg-terminal text-terminal-text focus:ring-primary focus:border-primary"
                        aria-describedby="name-description"
                        autoComplete="name"
                        inputMode="text"
                        onFocus={() => trackFormInteraction('contact_form', 'focus', 'name')}
                      />
                    </FormControl>
                    <FormDescription id="name-description" className="text-xs text-muted-foreground">
                      Your full name
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm text-terminal-text">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        className="border-terminal-border bg-terminal text-terminal-text focus:ring-primary focus:border-primary"
                        aria-describedby="email-description"
                        autoComplete="email"
                        inputMode="email"
                        onFocus={() => trackFormInteraction('contact_form', 'focus', 'email')}
                      />
                    </FormControl>
                    <FormDescription id="email-description" className="text-xs text-muted-foreground">
                      We'll never share your email
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm text-terminal-text">Subject</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="What's this about?"
                        className="border-terminal-border bg-terminal text-terminal-text focus:ring-primary focus:border-primary"
                        aria-describedby="subject-description"
                        autoComplete="off"
                        inputMode="text"
                        onFocus={() => trackFormInteraction('contact_form', 'focus', 'subject')}
                      />
                    </FormControl>
                    <FormDescription id="subject-description" className="text-xs text-muted-foreground">
                      Brief subject of your message
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm text-terminal-text">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your message here..."
                        rows={4}
                        className="border-terminal-border bg-terminal text-terminal-text focus:ring-primary focus:border-primary resize-none"
                        aria-describedby="message-description"
                        inputMode="text"
                        onFocus={() => trackFormInteraction('contact_form', 'focus', 'message')}
                      />
                    </FormControl>
                    <FormDescription id="message-description" className="text-xs text-muted-foreground">
                      Your detailed message (10-2000 characters)
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full terminal-panel border-terminal-border hover:bg-primary/20 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;