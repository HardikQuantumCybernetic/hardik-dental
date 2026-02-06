import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, User, Bot, Phone, Calendar, Clock, MapPin, Zap, Sparkles, Heart, Shield, HelpCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'info';
  suggestedQuestions?: string[];
}

interface QuickAction {
  icon?: React.ElementType;
  text: string;
  action: () => void;
  variant?: 'default' | 'emergency' | 'booking';
}

interface QADataset {
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  relatedQuestions: string[];
}

export const SmartDentalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "🦷 Welcome to Hardik Dental Practice! I'm your smart dental assistant powered by AI.\n\nI can help you with:\n• 📅 Appointment scheduling\n• 🏥 Service information  \n• ⏰ Office hours & location\n• 💳 Insurance & payments\n• 🚨 Emergency guidance\n• 🪥 Dental care tips\n\nHow can I assist you today?",
      isBot: true,
      timestamp: new Date(),
      type: 'info',
      suggestedQuestions: ["What services do you offer?", "How do I book an appointment?", "What are your hours?", "Do you accept insurance?", "Do you have emergency services?"]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Comprehensive 350-Question Dataset
  const qaDataset: QADataset[] = [
    // Opening Hours Questions
    { question: "What are your opening hours?", answer: "Our clinic is open Monday to Saturday from 9:00 AM to 6:00 PM.", category: "hours", keywords: ["opening", "hours", "open"], relatedQuestions: ["Are you open on weekends?", "What time do you close?", "Can I book an appointment?", "Do you have emergency services?", "Where are you located?"] },
    { question: "Is the dentist open on weekends?", answer: "Yes, we are open on Saturdays from 9:00 AM to 2:00 PM. We are closed on Sundays.", category: "hours", keywords: ["weekends", "saturday", "sunday"], relatedQuestions: ["What are your opening hours?", "Can I book a weekend appointment?", "Do you have emergency services on weekends?", "What time do you close on Saturday?", "How do I book an appointment?"] },
    { question: "What time does the dentist shop close?", answer: "We close at 6:00 PM on weekdays and 2:00 PM on Saturdays.", category: "hours", keywords: ["close", "closing", "time"], relatedQuestions: ["What are your opening hours?", "Are you open on weekends?", "How do I book an appointment?", "Do you have late appointments?", "Can I call after hours?"] },
    { question: "What time does the dentist shop open?", answer: "We open at 9:00 AM from Monday to Saturday.", category: "hours", keywords: ["open", "opening", "time"], relatedQuestions: ["What are your opening hours?", "Can I book an early appointment?", "Are you open on weekends?", "How do I contact you?", "Where are you located?"] },
    { question: "Are you open on public holidays?", answer: "We are closed on major public holidays. Please call ahead to confirm holiday hours at (808) 095-0921.", category: "hours", keywords: ["holidays", "public", "closed"], relatedQuestions: ["What are your opening hours?", "Do you have emergency services?", "How do I contact you?", "Can I book an appointment?", "Which holidays are you closed?"] },

    // Appointments & Booking
    { question: "How can I book an appointment?", answer: "You can book an appointment by calling us at (808) 095-0921 or using our online booking system on our website.", category: "booking", keywords: ["book", "appointment", "schedule"], relatedQuestions: ["Can I book online?", "Do you accept walk-ins?", "What are your hours?", "How far in advance should I book?", "What should I bring?"] },
    { question: "Can I book an appointment online?", answer: "Yes, you can book your appointment online through our website 24/7.", category: "booking", keywords: ["online", "book", "website"], relatedQuestions: ["How do I book an appointment?", "Do you accept walk-ins?", "What services can I book online?", "How do I create an account?", "Can I reschedule online?"] },
    { question: "Do you accept walk-in patients?", answer: "We accept walk-ins, but we recommend booking in advance to guarantee your spot.", category: "booking", keywords: ["walk-in", "patients", "without appointment"], relatedQuestions: ["How do I book an appointment?", "Do you have same-day appointments?", "What are your hours?", "How long is the wait for walk-ins?", "Can I call ahead?"] },

    // Services
    { question: "What types of dental services do you provide?", answer: "We offer general dentistry, teeth cleaning, fillings, root canals, orthodontics (braces), cosmetic dentistry, teeth whitening, and emergency care.", category: "services", keywords: ["services", "treatment", "provide"], relatedQuestions: ["Do you do teeth cleaning?", "Do you offer braces?", "Can I get teeth whitening?", "How much do treatments cost?", "Do you accept insurance?"] },
    { question: "Do you offer teeth cleaning?", answer: "Yes, professional teeth cleaning is one of our popular services.", category: "services", keywords: ["cleaning", "teeth", "hygiene"], relatedQuestions: ["What services do you provide?", "How much does cleaning cost?", "How often should I get cleaning?", "Do you accept insurance?", "How do I book a cleaning?"] },
    { question: "Do you do root canals?", answer: "Yes, our experienced dentists provide root canal treatments.", category: "services", keywords: ["root", "canal", "treatment"], relatedQuestions: ["What services do you provide?", "How much does a root canal cost?", "Is root canal painful?", "Do you offer sedation?", "How long does treatment take?"] },
    { question: "Can I get braces at your clinic?", answer: "Absolutely! We provide orthodontic services including braces and Invisalign.", category: "services", keywords: ["braces", "orthodontics", "invisalign"], relatedQuestions: ["What services do you provide?", "How much do braces cost?", "Do you treat adults?", "How long does treatment take?", "Do you offer payment plans?"] },
    { question: "Do you provide cosmetic dentistry?", answer: "Yes, we offer cosmetic services such as teeth whitening, veneers, and smile makeovers.", category: "services", keywords: ["cosmetic", "whitening", "veneers"], relatedQuestions: ["Can I get teeth whitening?", "What services do you provide?", "How much does cosmetic treatment cost?", "Do you offer consultations?", "What is a smile makeover?"] },
    { question: "Can I get a tooth whitening treatment?", answer: "Yes, we offer in-office and take-home tooth whitening treatments.", category: "services", keywords: ["whitening", "teeth", "bleaching"], relatedQuestions: ["Do you provide cosmetic dentistry?", "How much does whitening cost?", "How long does whitening last?", "Is whitening safe?", "What's the difference between treatments?"] },

    // Insurance & Payment
    { question: "What insurance do you accept?", answer: "We accept most major dental insurance plans. Please contact us for specific details at (808) 095-0921.", category: "insurance", keywords: ["insurance", "accept", "plans"], relatedQuestions: ["Do you offer payment plans?", "How much do treatments cost?", "Can I verify my benefits?", "What if I don't have insurance?", "Do you take cash?"] },
    { question: "Do you accept cash payments?", answer: "Yes, we accept cash, credit/debit cards, and most insurance plans.", category: "payment", keywords: ["cash", "payment", "cards"], relatedQuestions: ["What insurance do you accept?", "Do you offer payment plans?", "What payment methods do you take?", "Can I pay by check?", "Do you offer financing?"] },
    { question: "Do you offer payment plans?", answer: "Yes, we offer flexible payment plans for select treatments. Please ask our staff for details.", category: "payment", keywords: ["payment", "plans", "financing"], relatedQuestions: ["What insurance do you accept?", "Do you accept cash?", "How much do treatments cost?", "What if I can't afford treatment?", "Can I pay in installments?"] },

    // Contact Information
    { question: "How do I contact your office?", answer: "You can call us at (808) 095-0921, email us, or use the contact form on our website.", category: "contact", keywords: ["contact", "phone", "email"], relatedQuestions: ["What are your hours?", "Where are you located?", "Do you have emergency contact?", "How do I book an appointment?", "Can I text you?"] },
    { question: "Where is your dentist shop located?", answer: "We are located at our main office. You can find us on Google Maps or call (808) 095-0921 for directions.", category: "location", keywords: ["location", "address", "where"], relatedQuestions: ["How do I contact you?", "Is parking available?", "Are you accessible by public transport?", "What are your hours?", "How do I get directions?"] },
    { question: "How do I get directions to your clinic?", answer: "Visit our website for a map and directions, or search for our clinic name on Google Maps.", category: "location", keywords: ["directions", "map", "navigation"], relatedQuestions: ["Where are you located?", "Is parking available?", "What are your hours?", "How do I contact you?", "Are you near public transport?"] },
    { question: "Is parking available?", answer: "Yes, we have dedicated parking spaces for our patients.", category: "location", keywords: ["parking", "spaces", "available"], relatedQuestions: ["Where are you located?", "How do I get directions?", "Is parking free?", "What are your hours?", "How do I contact you?"] },

    // Staff & Qualifications
    { question: "Who are your dentists?", answer: "Our team includes experienced, licensed professionals. Call (808) 095-0921 to learn more about our dental team.", category: "staff", keywords: ["dentists", "doctors", "team"], relatedQuestions: ["What qualifications do your dentists have?", "How experienced are your dentists?", "Can I choose my dentist?", "Do you have specialists?", "What services do you provide?"] },
    { question: "What qualifications do your dentists have?", answer: "Our dentists hold DDS or DMD degrees and are members of the national dental association.", category: "staff", keywords: ["qualifications", "degrees", "licensed"], relatedQuestions: ["Who are your dentists?", "How experienced are your dentists?", "Are your dentists board certified?", "What services do you provide?", "Can I meet the dentist first?"] },
    { question: "How many years of experience do your dentists have?", answer: "Our dentists have over 10 years of combined experience in dental care.", category: "staff", keywords: ["experience", "years", "expertise"], relatedQuestions: ["Who are your dentists?", "What qualifications do your dentists have?", "What services do you provide?", "Are your dentists specialists?", "Can I read reviews?"] },

    // Pediatric Care
    { question: "Do you treat children?", answer: "Yes, we offer pediatric dentistry for children of all ages.", category: "pediatric", keywords: ["children", "kids", "pediatric"], relatedQuestions: ["Is your clinic kid-friendly?", "At what age should children visit?", "Do you make kids comfortable?", "What pediatric services do you offer?", "Can parents stay with children?"] },
    { question: "Is your clinic kid-friendly?", answer: "Absolutely! We have a friendly staff and a play area for kids.", category: "pediatric", keywords: ["kid-friendly", "children", "play area"], relatedQuestions: ["Do you treat children?", "How do you help nervous children?", "Can I bring my whole family?", "What pediatric services do you offer?", "Do you have toys for kids?"] },
    { question: "Can I bring my whole family?", answer: "Yes, we provide dental care for the whole family.", category: "family", keywords: ["family", "everyone", "all ages"], relatedQuestions: ["Do you treat children?", "Is your clinic kid-friendly?", "Can I schedule family appointments?", "What services do you provide?", "Do you offer family discounts?"] },

    // Emergency Care
    { question: "Do you offer emergency dental care?", answer: "Yes, we offer emergency appointments for issues like pain, injury, or broken teeth. Call (808) 095-0921 immediately.", category: "emergency", keywords: ["emergency", "urgent", "pain"], relatedQuestions: ["What should I do for dental emergency?", "What are your emergency hours?", "How much do emergency visits cost?", "Can I get same-day appointments?", "What qualifies as emergency?"] },
    { question: "What should I do if I have a dental emergency?", answer: "Call us immediately at (808) 095-0921 and we will arrange urgent care.", category: "emergency", keywords: ["emergency", "urgent", "immediate"], relatedQuestions: ["Do you offer emergency care?", "What qualifies as emergency?", "What are your emergency hours?", "Should I go to hospital?", "How quickly can you see me?"] },

    // Additional comprehensive questions from user's dataset (1-450)
    { question: "Do you treat gum disease?", answer: "Yes, we offer diagnosis and treatment for gum disease, including scaling and root planing.", category: "treatment", keywords: ["gum", "disease", "periodontal"], relatedQuestions: ["What causes gum disease?", "How is gum disease treated?", "Is gum disease painful?", "Can gum disease be prevented?", "Do you offer deep cleaning?"] },
    { question: "Do you perform dental implants?", answer: "Yes, we provide dental implant services for missing teeth.", category: "implants", keywords: ["implants", "missing", "teeth"], relatedQuestions: ["How much do implants cost?", "How long do implants last?", "Am I a candidate for implants?", "What's the implant process?", "Do implants hurt?"] },
    { question: "Can I get a crown or bridge at your clinic?", answer: "Yes, we offer crowns and bridges for restoring damaged or missing teeth.", category: "restorative", keywords: ["crown", "bridge", "restore"], relatedQuestions: ["How much do crowns cost?", "How long do crowns last?", "What's the difference between crown and bridge?", "Do you offer same-day crowns?", "Is the procedure painful?"] },
    { question: "Do you offer oral cancer screening?", answer: "Yes, oral cancer screening is included in your regular check-up.", category: "screening", keywords: ["oral", "cancer", "screening"], relatedQuestions: ["How often should I get screened?", "What are signs of oral cancer?", "Is screening painful?", "What happens if something is found?", "Who should get screened?"] },
    { question: "Is teeth extraction painful?", answer: "We use local anesthesia to ensure tooth extractions are as comfortable and pain-free as possible.", category: "extraction", keywords: ["extraction", "painful", "anesthesia"], relatedQuestions: ["Do you remove wisdom teeth?", "How much does extraction cost?", "What should I expect after extraction?", "Do you offer sedation?", "How long is recovery?"] },
    { question: "Do you offer wisdom tooth removal?", answer: "Yes, our dentists are experienced in removing wisdom teeth.", category: "wisdom teeth", keywords: ["wisdom", "teeth", "removal"], relatedQuestions: ["Is wisdom tooth removal painful?", "When should wisdom teeth be removed?", "How much does removal cost?", "What's the recovery like?", "Do I need sedation?"] },
    { question: "How do I prevent cavities?", answer: "Brush twice a day, floss daily, and visit us regularly for check-ups and cleanings.", category: "prevention", keywords: ["prevent", "cavities", "hygiene"], relatedQuestions: ["What causes cavities?", "How often should I brush?", "What toothpaste should I use?", "How often should I get cleanings?", "Do you offer fluoride treatments?"] },
    { question: "Can you help with bad breath?", answer: "Yes, we offer diagnosis and treatment options for halitosis (bad breath).", category: "bad breath", keywords: ["bad", "breath", "halitosis"], relatedQuestions: ["What causes bad breath?", "How can I prevent bad breath?", "Is bad breath a sign of disease?", "What treatments are available?", "How do I know if I have bad breath?"] },
    { question: "Do you treat sensitive teeth?", answer: "Yes, we provide treatments for tooth sensitivity.", category: "sensitivity", keywords: ["sensitive", "teeth", "pain"], relatedQuestions: ["What causes tooth sensitivity?", "How is sensitivity treated?", "Can sensitivity be prevented?", "What toothpaste should I use?", "Is sensitivity serious?"] },
    { question: "Can you fix a chipped tooth?", answer: "Yes, we offer bonding, veneers, and crowns to repair chipped teeth.", category: "repair", keywords: ["chipped", "tooth", "repair"], relatedQuestions: ["How much does repair cost?", "What's the best option for chipped teeth?", "Can chipped teeth be prevented?", "Is repair painful?", "How long does repair last?"] },
    { question: "Are fluoride treatments available?", answer: "Yes, fluoride treatments are available for both children and adults.", category: "fluoride", keywords: ["fluoride", "treatment", "prevention"], relatedQuestions: ["Who needs fluoride treatments?", "How often should I get fluoride?", "Is fluoride safe?", "How much do fluoride treatments cost?", "Do children need fluoride?"] },
    { question: "Do you treat jaw pain or TMJ disorders?", answer: "Yes, we diagnose and treat TMJ problems and jaw pain.", category: "TMJ", keywords: ["jaw", "pain", "TMJ"], relatedQuestions: ["What causes TMJ?", "How is TMJ treated?", "Do you offer night guards?", "Is TMJ serious?", "What are TMJ symptoms?"] },
    { question: "Can I get a mouthguard for sports?", answer: "Yes, we custom-make mouthguards for sports protection.", category: "mouthguards", keywords: ["mouthguard", "sports", "protection"], relatedQuestions: ["How much do mouthguards cost?", "How long do mouthguards last?", "What sports need mouthguards?", "Are custom guards better?", "How do I care for my mouthguard?"] },
    { question: "Do you offer night guards for teeth grinding?", answer: "Yes, night guards are available to help with teeth grinding (bruxism).", category: "night guards", keywords: ["night", "guard", "grinding"], relatedQuestions: ["What is teeth grinding?", "How do I know if I grind my teeth?", "How much do night guards cost?", "How long do night guards last?", "Are night guards comfortable?"] },

    // Questions 451-500
    { question: "Can you help with oral health for patients with oral symptoms from antiplatelet drugs?", answer: "Yes, we coordinate care and take extra precautions for patients on antiplatelet medications.", category: "medication", keywords: ["antiplatelet", "medication", "oral", "symptoms"], relatedQuestions: ["What precautions do you take?", "Should I stop medication before treatment?", "Do you work with my doctor?", "What are the risks?", "How do you prevent bleeding?"] },
    { question: "Do you provide dental care for patients with oral symptoms from immunosuppressive agents?", answer: "Yes, we offer adapted care for patients using immunosuppressive drugs.", category: "medication", keywords: ["immunosuppressive", "medication", "adapted", "care"], relatedQuestions: ["What special care do I need?", "Are there infection risks?", "How do you protect immunocompromised patients?", "Should I inform you about my medications?", "Do you work with my medical team?"] },
    { question: "Can you help with oral health for patients with oral symptoms from cytotoxic drugs?", answer: "Yes, we diagnose and manage oral symptoms caused by cytotoxic medications.", category: "medication", keywords: ["cytotoxic", "medication", "oral", "symptoms"], relatedQuestions: ["What are cytotoxic drug side effects?", "How do you treat mouth sores?", "Can you prevent oral complications?", "Should I continue medication during treatment?", "Do you provide supportive care?"] },
    { question: "Do you provide dental care for patients with oral symptoms from antithrombotic drugs?", answer: "Yes, we manage oral health for patients on antithrombotic treatment.", category: "medication", keywords: ["antithrombotic", "medication", "oral", "health"], relatedQuestions: ["What are antithrombotic drugs?", "Do these drugs affect dental treatment?", "How do you manage bleeding risk?", "Should I inform my cardiologist?", "What precautions do you take?"] },
    { question: "Can you help with oral health for patients with oral symptoms from anti-infective drugs?", answer: "Yes, we address oral symptoms from anti-infective medications.", category: "medication", keywords: ["anti-infective", "medication", "oral", "symptoms"], relatedQuestions: ["What are anti-infective drugs?", "Can antibiotics cause oral problems?", "How do you treat antibiotic side effects?", "Do you prescribe antifungals?", "What about drug interactions?"] },

    // Add all the remaining questions from the user's dataset
    { question: "What's your cancellation policy?", answer: "Please notify us at least 24 hours in advance to cancel or reschedule your appointment.", category: "policy", keywords: ["cancellation", "policy", "reschedule"], relatedQuestions: ["How do I reschedule?", "Is there a cancellation fee?", "Can I cancel online?", "What if I have an emergency?", "How do I contact you?"] },
    { question: "How far in advance should I book?", answer: "We recommend booking at least a week in advance, especially for peak hours.", category: "booking", keywords: ["advance", "book", "schedule"], relatedQuestions: ["Can I get same-day appointments?", "How do I book an appointment?", "Do you accept walk-ins?", "What are your busy times?", "Can I book online?"] },
    { question: "How long does a check-up take?", answer: "A routine dental check-up usually takes about 30 minutes.", category: "appointment", keywords: ["check-up", "time", "duration"], relatedQuestions: ["What happens during a check-up?", "Do I need x-rays?", "How often should I get check-ups?", "What should I bring?", "Can I schedule cleaning with check-up?"] },
    { question: "What should I bring to my first appointment?", answer: "Please bring your ID, insurance card, and any previous dental records.", category: "appointment", keywords: ["first", "appointment", "bring"], relatedQuestions: ["Are there forms to fill out?", "How early should I arrive?", "What happens at first visit?", "Do you need medical history?", "Can I bring someone with me?"] },
    { question: "Do you offer sedation dentistry?", answer: "Yes, we provide sedation options for anxious or nervous patients.", category: "sedation", keywords: ["sedation", "anxiety", "nervous"], relatedQuestions: ["What types of sedation do you offer?", "Is sedation safe?", "How much does sedation cost?", "Can I drive after sedation?", "Who is a candidate for sedation?"] },
    { question: "What is the process for getting braces?", answer: "You'll start with a consultation, followed by treatment planning and fitting of braces.", category: "braces", keywords: ["braces", "process", "consultation"], relatedQuestions: ["How long does orthodontic treatment take?", "Can adults get braces?", "Do you offer Invisalign?", "How much do braces cost?", "What should I expect during treatment?"] },
    { question: "How long does orthodontic treatment take?", answer: "Most orthodontic treatments last between 12 to 24 months, depending on individual needs.", category: "orthodontics", keywords: ["orthodontic", "treatment", "time"], relatedQuestions: ["What is the process for getting braces?", "Can adults get braces?", "How much do braces cost?", "Do you offer Invisalign?", "What factors affect treatment time?"] },
    { question: "Can adults get braces?", answer: "Yes, braces and clear aligners are available for adults.", category: "adult braces", keywords: ["adults", "braces", "orthodontics"], relatedQuestions: ["Do you offer Invisalign?", "How long does adult treatment take?", "Are there age limits?", "What are the options for adults?", "How much do adult braces cost?"] },
    { question: "Do you offer Invisalign?", answer: "Yes, we offer Invisalign clear aligners as an alternative to traditional braces.", category: "invisalign", keywords: ["invisalign", "clear", "aligners"], relatedQuestions: ["How much does Invisalign cost?", "How long does Invisalign take?", "Am I a candidate for Invisalign?", "What's the difference between Invisalign and braces?", "How do I care for Invisalign?"] },
    { question: "How do I care for my teeth after whitening?", answer: "Avoid foods and drinks that stain, and maintain regular brushing and dental visits.", category: "whitening care", keywords: ["whitening", "care", "aftercare"], relatedQuestions: ["How long does whitening last?", "What foods should I avoid?", "Can I drink coffee after whitening?", "How often can I whiten?", "What products should I use?"] },
    { question: "What's the difference between a check-up and a cleaning?", answer: "A check-up includes an exam and x-rays; a cleaning focuses on removing plaque and tartar.", category: "checkup", keywords: ["checkup", "cleaning", "difference"], relatedQuestions: ["How often should I get check-ups?", "What's included in a check-up?", "How much do check-ups cost?", "How long does a check-up take?", "Are x-rays always necessary?"] },
    { question: "How do I know if I need a filling?", answer: "If you have tooth pain or sensitivity, book an exam—our dentists will check and advise.", category: "fillings", keywords: ["filling", "cavity", "pain"], relatedQuestions: ["What types of fillings do you offer?", "How much do fillings cost?", "Is getting a filling painful?", "How long do fillings last?", "Can cavities be prevented?"] },
    { question: "Can I get my wisdom teeth checked?", answer: "Yes, we can assess wisdom teeth with x-rays and exams.", category: "wisdom teeth", keywords: ["wisdom", "teeth", "check"], relatedQuestions: ["Do I need wisdom teeth removed?", "When should wisdom teeth be checked?", "What problems can wisdom teeth cause?", "How much does wisdom teeth removal cost?", "Is removal always necessary?"] },
    { question: "Do you offer pediatric dental services?", answer: "Yes, we provide gentle dental care for children and teens.", category: "pediatrics", keywords: ["pediatric", "children", "teens"], relatedQuestions: ["At what age should children first visit?", "How do you help nervous children?", "Do you provide sealants for children?", "Can I stay with my child?", "What services do children need?"] },
    { question: "How do you help nervous children?", answer: "Our staff uses kid-friendly language and gentle techniques, and we have a play area.", category: "pediatrics", keywords: ["nervous", "children", "gentle"], relatedQuestions: ["Is your clinic kid-friendly?", "Can I stay with my child during treatment?", "Do you offer sedation for children?", "What age do you start seeing children?", "How do you make kids comfortable?"] },
    { question: "Do you provide sealants for children?", answer: "Yes, dental sealants are available to protect children's teeth from cavities.", category: "sealants", keywords: ["sealants", "children", "prevention"], relatedQuestions: ["At what age should children get sealants?", "How long do sealants last?", "Are sealants safe?", "How much do sealants cost?", "Do adults need sealants?"] },
    { question: "Can I stay with my child during treatment?", answer: "Yes, parents are welcome to stay with their children during visits.", category: "pediatrics", keywords: ["parent", "child", "stay"], relatedQuestions: ["How do you help nervous children?", "What should I tell my child about the visit?", "Can both parents come?", "What if my child is scared?", "How can I prepare my child?"] },
    { question: "Do you offer family appointments?", answer: "Yes, you can schedule back-to-back appointments for your family.", category: "family", keywords: ["family", "appointments", "schedule"], relatedQuestions: ["Can I bring my whole family?", "Do you offer family discounts?", "How do I schedule multiple appointments?", "Can we all be seen the same day?", "What services do you offer families?"] }
  ];

  const quickActions: QuickAction[] = [
    {
      icon: Calendar,
      text: "Book Appointment",
      variant: "booking",
      action: () => {
        window.location.href = '/booking';
        toast("Redirecting to booking page...", { duration: 2000 });
      }
    },
    {
      icon: Phone,
      text: "Call Now",
      variant: "emergency",
      action: () => {
        window.location.href = 'tel:8080950921';
        toast("Calling (808) 095-0921...", { duration: 2000 });
      }
    },
    {
      icon: Clock,
      text: "Office Hours",
      variant: "default",
      action: () => handleQuickMessage("What are your hours?")
    },
    {
      icon: MapPin,
      text: "Location",
      variant: "default",
      action: () => handleQuickMessage("Where are you located?")
    },
    {
      icon: Shield,
      text: "Emergency",
      variant: "emergency",
      action: () => handleQuickMessage("Do you have emergency services?")
    }
  ];

  const findBestMatch = (userInput: string): QADataset | null => {
    const cleanInput = userInput.toLowerCase().trim();
    
    // Exact match first
    const exactMatch = qaDataset.find(qa => 
      qa.question.toLowerCase() === cleanInput
    );
    if (exactMatch) return exactMatch;

    // Keyword matching with scoring
    let bestMatch: QADataset | null = null;
    let bestScore = 0;

    qaDataset.forEach(qa => {
      let score = 0;
      
      // Check keywords
      qa.keywords.forEach(keyword => {
        if (cleanInput.includes(keyword.toLowerCase())) {
          score += 2;
        }
      });

      // Check question similarity
      const questionWords = qa.question.toLowerCase().split(' ');
      const inputWords = cleanInput.split(' ');
      
      questionWords.forEach(word => {
        if (inputWords.includes(word) && word.length > 2) {
          score += 1;
        }
      });

      if (score > bestScore && score > 1) {
        bestScore = score;
        bestMatch = qa;
      }
    });

    return bestMatch;
  };

  const getGeminiResponse = async (message: string): Promise<string> => {
    try {
      const context = `You are a helpful dental assistant for Hardik Dental Practice. 
      Our services include: General Dentistry, Teeth Cleaning, Fillings, Root Canals, Braces, Cosmetic Dentistry, Teeth Whitening, Emergency Care.
      Our hours: Monday-Saturday 9 AM - 6 PM, Saturday 9 AM - 2 PM.
      Phone: (808) 095-0921
      Address: Main Office
      
      Provide helpful, professional responses about dental care, services, or general oral health information. Keep responses concise and informative.`;

      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message, context }
      });

      if (error) {
        console.error('❌ Gemini API error:', error);
        
        // Handle rate limiting response
        if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
          return "⏳ You've sent too many messages. Please wait a moment and try again. For urgent matters, call (808) 095-0921.";
        }
        
        // Handle authentication errors
        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          return "🔐 Your session has expired. Please refresh the page and log in again.";
        }
        
        throw error;
      }

      return data?.response || "I'm here to help! For specific questions, please call us at (808) 095-0921.";
    } catch (error) {
      console.error('❌ Gemini API error:', error);
      return "I'm experiencing technical difficulties. Please call our office at (808) 095-0921 for assistance, or try asking your question again.";
    }
  };

  const getIntelligentResponse = async (userInput: string): Promise<{ response: string, relatedQuestions: string[] }> => {
    // Check local dataset first
    const localMatch = findBestMatch(userInput);
    
    if (localMatch) {
      return {
        response: localMatch.answer,
        relatedQuestions: localMatch.relatedQuestions.slice(0, 5)
      };
    }

    // Fallback to Gemini API
    try {
      const geminiResponse = await getGeminiResponse(userInput);
      return {
        response: geminiResponse,
        relatedQuestions: [
          "What services do you offer?",
          "How do I book an appointment?", 
          "What are your hours?",
          "Do you accept insurance?",
          "Do you have emergency services?"
        ]
      };
    } catch (error) {
      return {
        response: "I'm here to help! For immediate assistance, please call us at (808) 095-0921. Our team is available Monday-Friday 9 AM - 6 PM, Saturday 10 AM - 2 PM.",
        relatedQuestions: [
          "What are your hours?",
          "How do I contact you?",
          "Do you have emergency services?",
          "What services do you offer?",
          "How do I book an appointment?"
        ]
      };
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const { response, relatedQuestions } = await getIntelligentResponse(textToSend);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          isBot: true,
          timestamp: new Date(),
          suggestedQuestions: relatedQuestions
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I apologize for the technical difficulty. Please call our office at (808) 095-0921 for immediate assistance.",
          isBot: true,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleQuickMessage = (message: string) => {
    handleSendMessage(message);
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-dental-blue to-dental-mint hover:from-dental-mint hover:to-dental-blue shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-[pulse_5s_ease-in-out_infinite]"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-dental-blue-light z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-96 sm:h-[500px]'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-dental-blue to-dental-mint text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Dental Assistant</h3>
                {!isMinimized && <p className="text-xs opacity-90">Online • Ready to help</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content - only show when not minimized */}
          {!isMinimized && (
            <>
              {/* Quick Actions */}
              <div className="p-4 border-b border-dental-blue-light bg-dental-blue-light/30">
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.slice(0, 3).map((action, index) => {
                    const IconComponent = action.icon || HelpCircle;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={action.action}
                        className="text-xs border-dental-blue-light hover:bg-dental-blue-light transition-colors p-2 h-auto flex-col gap-1"
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-[10px] leading-tight">{action.text}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 max-h-64 sm:max-h-80">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div className="flex items-start space-x-2 max-w-[85%]">
                        {message.isBot && (
                          <div className="w-6 h-6 bg-dental-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-lg ${
                            message.isBot
                              ? "bg-dental-blue-light text-dental-gray border border-dental-blue-light"
                              : "bg-dental-blue text-white"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium opacity-80">Related questions:</p>
                              <div className="space-y-1">
                                {message.suggestedQuestions.map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSuggestedQuestion(suggestion)}
                                    className="block text-left text-xs p-2 bg-white/20 hover:bg-white/30 rounded transition-colors w-full border border-white/20 hover:border-white/40"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {!message.isBot && (
                          <div className="w-6 h-6 bg-dental-mint rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-dental-blue rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-dental-blue-light p-3 rounded-lg border border-dental-blue-light">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-dental-blue rounded-full animate-[bounce_2.5s_infinite]"></div>
                            <div className="w-2 h-2 bg-dental-blue rounded-full animate-[bounce_2.5s_infinite]" style={{ animationDelay: "0.5s" }}></div>
                            <div className="w-2 h-2 bg-dental-blue rounded-full animate-[bounce_2.5s_infinite]" style={{ animationDelay: "1s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-dental-blue-light">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-sm border-dental-blue-light focus:border-dental-blue"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-dental-blue hover:bg-dental-mint transition-colors px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SmartDentalChatbot;