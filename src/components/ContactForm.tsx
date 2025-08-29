import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
import { Send, Loader2 } from "lucide-react";
import { useEnhancedAnalytics } from "@/hooks/useAnalytics";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
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
        
        toast.success("Message sent successfully!");
        form.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Track form error
      trackFormInteraction('contact_form', 'error');
      
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
  );
};

export default ContactForm;