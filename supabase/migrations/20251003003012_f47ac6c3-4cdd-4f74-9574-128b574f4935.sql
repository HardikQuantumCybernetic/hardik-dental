-- Insert sample feedback and contact message data for testing
INSERT INTO feedback (patient_name, patient_email, rating, message, category, status) VALUES
('John Smith', 'john.smith@email.com', 5, 'Excellent service! The staff was very professional and the treatment was painless. Dr. Johnson explained everything clearly and made me feel comfortable throughout the procedure.', 'service', 'new'),
('Sarah Johnson', 'sarah.j@email.com', 4, 'Very satisfied with my dental cleaning. The hygienist was gentle and thorough. The office is clean and modern. Only minor complaint is the waiting time.', 'general', 'reviewed'),
('Mike Davis', 'mike.davis@email.com', 5, 'Amazing experience! I was nervous about my root canal but Dr. Smith made it completely comfortable. The whole team is fantastic.', 'service', 'reviewed'),
('Emily Brown', 'emily.brown@email.com', 4, 'Great dental practice. Very professional and caring staff. The appointment was on time and efficient. Highly recommend!', 'general', 'new'),
('David Wilson', 'david.w@email.com', 3, 'Subject: Appointment Inquiry
Phone: (555) 123-9876

Message:
I would like to schedule a consultation for teeth whitening. What are your available time slots next week?', 'contact', 'new'),
('Lisa Martinez', 'lisa.martinez@email.com', 5, 'Subject: Follow-up Question
Phone: (555) 987-6543

Message:
Thank you for the excellent care during my last visit. I have a question about the aftercare instructions. Could someone call me back?', 'contact', 'reviewed');