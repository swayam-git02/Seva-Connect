import { useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

// Kept separate from business data: this only changes presentation copy and never
// touches input values, links, routes, API payloads, or user-provided content.
const HINDI_COPY = {
  'Services': 'सेवाएँ',
  'How It Works': 'यह कैसे काम करता है',
  'About': 'हमारे बारे में',
  'Contact': 'संपर्क करें',
  'Sign In': 'लॉग इन करें',
  'Sign in': 'लॉग इन करें',
  'Sign Up': 'साइन अप करें',
  'Sign Out': 'लॉग आउट',
  'Log Out': 'लॉग आउट',
  'Home': 'होम',
  'Dashboard': 'डैशबोर्ड',
  'Bookings': 'बुकिंग',
  'Profile': 'प्रोफ़ाइल',
  'Settings': 'सेटिंग्स',
  'Help & Support': 'सहायता और मदद',
  'Messages': 'संदेश',
  'Notifications': 'सूचनाएँ',
  'Overview': 'सारांश',
  'Find a Service': 'सेवा खोजें',
  'My Bookings': 'मेरी बुकिंग',
  'My Services': 'मेरी सेवाएँ',
  'My Profile': 'मेरी प्रोफ़ाइल',
  'Favorite Pros': 'पसंदीदा विशेषज्ञ',
  'Saved Pros': 'सहेजे गए विशेषज्ञ',
  'Customer Dashboard': 'ग्राहक डैशबोर्ड',
  'Partner Dashboard': 'पार्टनर डैशबोर्ड',
  'Booking Requests': 'बुकिंग अनुरोध',
  'My Services & Rates': 'मेरी सेवाएँ और दरें',
  'Calendar / Slots': 'कैलेंडर / समय स्लॉट',
  'My Customers': 'मेरे ग्राहक',
  'Earnings & Revenue': 'कमाई और आय',
  'Withdraw & Payouts': 'निकासी और भुगतान',
  'Customer Reviews': 'ग्राहक समीक्षाएँ',
  'KYC & Verification': 'केवाईसी और सत्यापन',
  'Business Profile': 'व्यवसाय प्रोफ़ाइल',
  'Partner Help': 'पार्टनर सहायता',
  'Online & Ready': 'ऑनलाइन और तैयार',
  'Back to Marketplace': 'मार्केटप्लेस पर वापस',
  'View Public Marketplace': 'पब्लिक मार्केटप्लेस देखें',
  'Go to My Dashboard': 'मेरे डैशबोर्ड पर जाएँ',
  'Go to Dashboard': 'डैशबोर्ड पर जाएँ',
  'Join as Professional': 'पेशेवर के रूप में जुड़ें',
  'Book a Service': 'सेवा बुक करें',
  'Book Service': 'सेवा बुक करें',
  'Book a New Service': 'नई सेवा बुक करें',
  'View all': 'सभी देखें',
  'View All Jobs': 'सभी काम देखें',
  'View All Bookings': 'सभी बुकिंग देखें',
  'View OTP & Live Tracking': 'ओटीपी और लाइव ट्रैकिंग देखें',
  'Manage Working Slots': 'काम के स्लॉट प्रबंधित करें',
  'Current Active Job': 'वर्तमान सक्रिय काम',
  'Full Job View': 'काम का पूरा विवरण',
  'New Booking Requests': 'नए बुकिंग अनुरोध',
  'Review address and scheduled time before accepting': 'स्वीकार करने से पहले पता और तय समय देखें',
  'All requests cleared!': 'सभी अनुरोध पूरे हो गए!',
  'New bookings in your sector will appear here instantly.': 'आपके क्षेत्र की नई बुकिंग यहाँ तुरंत दिखेंगी।',
  'Upcoming Appointment Today': 'आज की आने वाली अपॉइंटमेंट',
  'Recommended for Faridabad Homes': 'फरीदाबाद के घरों के लिए सुझाव',
  'Seasonal repairs and essential maintenance in your area': 'आपके क्षेत्र में मौसमी मरम्मत और जरूरी देखभाल',
  'Explore 40+ categories': '40+ श्रेणियाँ देखें',
  'Track & view history': 'स्थिति और इतिहास देखें',
  'Re-hire trusted experts': 'भरोसेमंद विशेषज्ञ को फिर बुलाएँ',
  '24/7 NCR desk': '24/7 एनसीआर सहायता',
  'Customer': 'ग्राहक',
  'Provider': 'सेवा प्रदाता',
  'Partner': 'पार्टनर',
  'Admin': 'एडमिन',
  'Email Address': 'ईमेल पता',
  'Password': 'पासवर्ड',
  'Confirm Password': 'पासवर्ड की पुष्टि करें',
  'Forgot Password?': 'पासवर्ड भूल गए?',
  'Create Account': 'खाता बनाएँ',
  'Full Name': 'पूरा नाम',
  'Phone Number': 'मोबाइल नंबर',
  'City / Area': 'शहर / क्षेत्र',
  'Save': 'सहेजें',
  'Cancel': 'रद्द करें',
  'Delete': 'हटाएँ',
  'Edit': 'बदलें',
  'Search': 'खोजें',
  'Back': 'वापस',
  'Close': 'बंद करें',
  'Loading...': 'लोड हो रहा है...',
  'Pending': 'लंबित',
  'Confirmed': 'पुष्ट',
  'On The Way': 'रास्ते में',
  'In Progress': 'काम जारी है',
  'Completed': 'पूरा हुआ',
  'Cancelled': 'रद्द किया गया',
  'Declined': 'अस्वीकार किया गया',
  'Payment Pending': 'भुगतान बाकी है',
  'Pay Now': 'अभी भुगतान करें',
  'Booking Details': 'बुकिंग का विवरण',
  'Service Address': 'सेवा का पता',
  'Customer Contact': 'ग्राहक संपर्क',
  'Language:': 'भाषा:',
  'Home Page': 'होम पेज',
};

const ATTRIBUTE_NAMES = ['placeholder', 'title', 'aria-label'];

/**
 * Adds a presentation-only Hindi layer for existing portal screens.  It lets
 * legacy pages participate in the same language preference without rewriting
 * their markup or changing any layout/functionality.
 */
export default function HindiLocalization() {
  const { isHindi } = useLanguage();
  const originalText = useRef(new WeakMap());
  const originalAttributes = useRef(new WeakMap());

  useEffect(() => {
    const translateTextNode = (node) => {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].includes(parent.tagName)) return;

      if (!originalText.current.has(node)) originalText.current.set(node, node.nodeValue);
      const source = originalText.current.get(node);
      const leadingWhitespace = source.match(/^\s*/)?.[0] || '';
      const trailingWhitespace = source.match(/\s*$/)?.[0] || '';
      const phrase = source.trim();
      const translated = HINDI_COPY[phrase];
      node.nodeValue = isHindi && translated
        ? `${leadingWhitespace}${translated}${trailingWhitespace}`
        : source;
    };

    const translateElement = (element) => {
      if (!(element instanceof HTMLElement)) return;
      ATTRIBUTE_NAMES.forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value === null) return;
        let originals = originalAttributes.current.get(element);
        if (!originals) {
          originals = new Map();
          originalAttributes.current.set(element, originals);
        }
        if (!originals.has(attribute)) originals.set(attribute, value);
        const source = originals.get(attribute);
        element.setAttribute(attribute, isHindi ? (HINDI_COPY[source] || source) : source);
      });
    };

    const translateTree = (root = document.body) => {
      if (!root) return;
      if (root.nodeType === Node.TEXT_NODE) translateTextNode(root);
      else if (root instanceof HTMLElement) translateElement(root);

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) translateTextNode(node);
      if (root instanceof HTMLElement) root.querySelectorAll('*').forEach(translateElement);
    };

    translateTree();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(translateTree);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isHindi]);

  return null;
}
