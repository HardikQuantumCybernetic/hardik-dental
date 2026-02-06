import React from 'react';
import { Helmet } from 'react-helmet-async';
import FeedbackPage from '@/components/FeedbackPage';

const Feedback: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Patient Feedback - Hardik Dental Practice</title>
        <meta name="description" content="Share your feedback about your experience at Hardik Dental Practice. We value your input to help us improve our dental services." />
        <meta name="keywords" content="dental feedback, patient review, dental experience, Hardik Dental Practice" />
        <link rel="canonical" href={`${window.location.origin}/feedback`} />
      </Helmet>
      <FeedbackPage />
    </>
  );
};

export default Feedback;