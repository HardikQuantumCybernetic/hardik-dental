import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business';
  structuredData?: object;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Professional Dental Care | Modern Dental Practice',
  description = 'Experience exceptional dental care with our modern practice. Comprehensive dental services including cleanings, cosmetic dentistry, and emergency care. Book your appointment today.',
  keywords = 'dental care, dentist, dental clinic, teeth cleaning, cosmetic dentistry, dental implants, oral health, preventive care',
  image = '/dental-og-image.jpg',
  url = 'https://your-dental-practice.com',
  type = 'business.business',
  structuredData
}) => {
  const siteTitle = 'DentalCare Pro';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": siteTitle,
    "description": description,
    "url": url,
    "logo": `${url}/logo.png`,
    "image": `${url}${image}`,
    "telephone": "+1-555-DENTAL",
    "email": "info@dentalcarepro.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Dental Street",
      "addressLocality": "Dental City",
      "addressRegion": "DC",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.7128",
      "longitude": "-74.0060"
    },
    "openingHours": [
      "Mo-Fr 08:00-18:00",
      "Sa 09:00-15:00"
    ],
    "priceRange": "$$",
    "acceptsReservations": true,
    "paymentAccepted": [
      "Cash",
      "Credit Card",
      "Insurance"
    ],
    "medicalSpecialty": [
      "General Dentistry",
      "Cosmetic Dentistry",
      "Oral Surgery",
      "Orthodontics"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${url}${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${url}${image}`} />
      
      {/* Additional Meta Tags for Medical/Dental Sites */}
      <meta name="author" content={siteTitle} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${siteTitle}`} />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>

      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme Color for Mobile Browsers */}
      <meta name="theme-color" content="#4F8BF7" />
      <meta name="msapplication-TileColor" content="#4F8BF7" />
    </Helmet>
  );
};

export default SEOHead;