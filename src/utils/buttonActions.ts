
export const handlePhoneCall = (phoneNumber: string) => {
  window.open(`tel:${phoneNumber}`, '_self');
};

export const handleEmail = (email: string, subject?: string) => {
  const mailtoUrl = subject 
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;
  window.open(mailtoUrl, '_self');
};

export const handleDirections = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  window.open(mapsUrl, '_blank');
};

export const handleEmergencyCall = () => {
  handlePhoneCall('(555) 123-4568');
};

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};
