// src/translations.js
const translations = {
  en: {
    home: "Home",
    about: "About",
    whyus: "Why Us",
    servicesTitle: "Services",
    membership: "Membership",
    news: "News",
    contact: "Contact",
    login: "Login",
    brand: "WERQAMA SACCO",

    // Hero Section
    heroTitle: "Empowering Your Financial Future",
    heroSubtitle:
      "Join WERQAMA SACCO to save, grow, and secure your financial future with trusted services, flexible loans, and community support.",
    heroCTA: "Get Started",

    // About Section
    aboutTitle: "About Us",
    visionTitle: "Our Vision",
    visionText:
      "To be the leading SACCO that empowers our community's financial stability and growth through innovative financial solutions and technology integration.",
    missionTitle: "Our Mission",
    missionText:
      "To provide accessible, sustainable, and inclusive financial services that uplift our members' economic status, supporting entrepreneurship and community initiatives.",
    valuesTitle: "Our Values",
    valuesText:
      "We value transparency, accountability, and community empowerment, ensuring financial literacy, ethical practices, and excellent member service.",

    // WhyUs Section
    whyusTitle: "Why Choose WERQAMA SACCO?",
    whyusSubtitle:
      "Discover the benefits of joining our trusted community-based SACCO and secure your financial future today.",
    benefits: [
      { title: "Grow Your Savings", description: "Earn dividends while building a secure financial future." },
      { title: "Access Affordable Loans", description: "Get loans at low rates to expand your business and family needs." },
      { title: "Secure & Transparent", description: "Your savings and transactions are protected at every step." },
      { title: "Financial Empowerment", description: "Gain financial education to manage your money wisely." },
    ],

    // Service Section
    Title: "Our Services",
    servicesSubtitle: "Empowering our members with savings and loan services tailored to your needs.",
    services: [
      {
        title: "Savings",
        description:
          "Flexible savings plans that secure your future with competitive interest rates, transparency, and easy access through digital banking.",
      },
      {
        title: "Loans",
        description:
          "Affordable and accessible loans designed to support your business, education, and personal growth with fair repayment terms.",
      },
    ],

    // Membership Section
    membershipTitle: "Join WERQAMA SACCO Today",
    membershipSubtitle: "Unlock access to loans, savings, and a supportive community.",
    membersActive: "Active Members",
    membersDesc: "Be part of a growing family securing financial freedom.",
    loansDisbursed: "Loans Disbursed",
    loansDesc: "Supporting businesses & personal goals affordably.",
    bankDetailsTitle: "Bank Details",
    bankDetails: (
      <>
        <strong>WERQAMA SACCO</strong>
        <br /> CBE: 1000123456789
        <br /> Awash: 0101010101
      </>
    ),
    membershipSteps: [
      { icon: "FaUserPlus", title: "Register", text: "Sign up easily to become a SACCO member." },
      { icon: "FaWallet", title: "Deposit", text: "Start saving with flexible contributions." },
      { icon: "FaHandHoldingUsd", title: "Apply Loan", text: "Request affordable loans for growth." },
      { icon: "FaUniversity", title: "Grow Together", text: "Enjoy financial support and benefits." },
    ],
    membershipCTA: "Apply for Membership",

    // News Section
    newsTitle: "News & Events",
    newsSubtitle: "Stay informed on the latest updates from WERQAMA SACCO",
    newsNoItems: "No news available currently.",
    newsReadMore: "Read More",
    newsClose: "Close",

    // Contact Section
    contactTitle: "Contact Us",
    contactSuccess: "Your message has been sent successfully!",
    contactError: "Something went wrong. Please try again.",
    contactName: "Name",
    contactEmail: "Email",
    contactReason: "Select Reason",
    contactReasonOptions: ["Support", "Inquiry", "Feedback", "Others"],
    contactMessage: "Your Message",
    contactSubmit: "Send Message",
    contactSending: "Sending...",

    footer: {
      sacco: "WERQAMA SACCO",
      subtitle: "Empowering your financial future with secure savings, affordable loans, and community-focused services across Ethiopia.",
      subscribers: "Subscribers",
      quickLinks: "Quick Links",
      links: {
        home: "Home",
        services: "Services",
        news: "News & Events",
        contact: "Contact Us",
        join: "Join Now",
      },
      contactUs: "Contact Us",
      phone: "+251 912 345 678",
      email: "info@werqamasacco.et",
      newsletter: "Newsletter",
      newsletterDesc: "Subscribe for the latest updates and financial tips.",
      subscribe: "Enter your email",
      subscribing: "Subscribing...",
      copyright: `© ${new Date().getFullYear()} WERQAMA SACCO. All rights reserved. | Developed by YourTeam`,
    },

  },
  am: {
    home: "መነሻ",
    about: "ስለ እኛ",
    whyus: "ለምን እኛ",
    services: "አገልግሎቶች",
    membership: "አባልነት",
    news: "ዜናና ክስተቶች",
    contact: "አድራሻ",
    login: "ግባ",
    brand: "ወርቃማ ሳኮ",

    // Hero Section
    heroTitle: "የወደፊት የፋይናንስ ችሎታዎን ማጎልበት",
    heroSubtitle:
      "በሚታመኑ አገልግሎቶች፣ በተለዋዋጭ ብድሮች እና በማህበረሰብ ድጋፍ የወደፊት የፋይናንስ ሁኔታዎን ለመቆጠብ፣ ለማደግ እና ለመጠበቅ ወርቃማ ሳኮን ይቀላቀሉ።",
    heroCTA: "ይጀምሩ",

    // About Section
    aboutTitle: "ስለ እኛ",
    visionTitle: "ራእያችን",
    visionText:
      "የማህበረሰባችንን የፋይናንስ መረጋጋት እና እድገት በፈጠራ የፋይናንሺያል መፍትሄዎች እና የቴክኖሎጂ ውህደት የሚያበረታ መሪ ብድርና ቁጠባ ለመሆን",
    missionTitle: "ተልእኮችን",
    missionText:
      "የአባሎቻችንን ኢኮኖሚያዊ ደረጃ ከፍ የሚያደርግ፣ የስራ ፈጠራ እና የማህበረሰብ ተነሳሽነትን የሚደግፉ ተደራሽ፣ ዘላቂ እና አካታች የፋይናንስ አገልግሎቶችን ለመስጠት።",
    valuesTitle: "እሴቶቻችን",
    valuesText:
      "ግልጽነትን፣ ተጠያቂነትን እና ማህበረሰብን ማጎልበት፣ የፋይናንሺያል እውቀትን፣ የስነምግባር ልምዶችን እና የላቀ የአባልነት አገልግሎትን እናከብራለን።",

    // WhyUs Section
    whyusTitle: "ለምን ወርቃማ ብድርና ቁጠባን ይምረጡ ?",
    whyusSubtitle:
      "የእኛን የታመነ ማህበረሰባዊ ተኮር ብድርና ቁጠባን በመቀላቀል ጥቅሞቹን ያግኙ እና የወደፊት የፋይናንስ ሁኔታዎን ዛሬ ያረጋግጡ።",
    benefits: [
      { title: "ቁጠባዎችዎን ያሳድጉ", description: "አስተማማኝ የወደፊት ፋይናንስ በሚገነቡበት ጊዜ ትርፍ ያግኙ።" },
      { title: "በቀላሉ ብድር ያግኙ", description: "የእርስዎን ንግድ እና የቤተሰብ ፍላጎቶች ለማስፋት በዝቅተኛ ወለድ ብድር ይውሰዱ።" },
      { title: "ደህንነትና ግልጽነት", description: "ቁጠባዎችና የግብይት ሂደቶች በእያንዳንዱ ደረጃ ይጠበቃሉ።" },
      { title: "የገንዘብ ማጎልበት", description: "ገንዘብዎን በጥበብ ለማስተዳደር የፋይናንስ ትምህርት ያግኙ።" },
    ],

    // Service Section
    servicesTitle: "አገልግሎቶቻችን",
    servicesSubtitle:
      "ለፍላጎትዎ በተዘጋጁ የቁጠባ እና የብድር አገልግሎቶች አባሎቻችንን ማብቃት",
    services: [  // ← already correct
      {
        title: "ቁጠባ",
        description:
          "ተለዋዋጭ የቁጠባ ዕቅዶች የወደፊትዎን በተወዳዳሪ የወለድ ተመኖች፣ ግልጽነት እና በቀላሉ በዲጂታል ባንኪንግ ማግኘት ይችላሉ።",
      },
      {
        title: "ብድር",
        description:
          "ለንግድ፣ ለትምህርትና ለግል እድገትዎ የተስማሚ የክፍያ ሁኔታ የተዘጋጀ ቀላልና ተመጣጣኝ ብድር።",
      },
    ],

    // Membership Section
    membershipTitle: "ዛሬ ወርቃማ ሳኮ ይቀላቀሉ",
    membershipSubtitle: "ብድር፣ ቁጠባ እና የድጋፍ ማህበረሰብ መድረስን ክፈት።",
    membersActive: "ንዑስ አባሎች",
    membersDesc: "የፋይናንስ ነፃነትን በማስቀመጥ በትልቅ ቤተሰብ ይካተቱ።",
    loansDisbursed: "ብድሮች ተከፍለዋል",
    loansDesc: "ንግድ እና የግል አሳማኝ እቅዶችን ይደግፋሉ።",
    bankDetailsTitle: "የባንክ ዝርዝሮች",
    bankDetails: (
      <>
        <strong>ወርቃማ ሳኮ</strong>
        <br /> CBE: 1000123456789
        <br /> Awash: 0101010101
      </>
    ),
    membershipSteps: [
      { icon: "FaUserPlus", title: "ይመዝገቡ", text: "ቀላል ለማድረግ አባል ይሁኑ።" },
      { icon: "FaWallet", title: "መቀመጫ", text: "በተለዋዋጭ እቅድ ጀምሩ ቁጠባዎች።" },
      { icon: "FaHandHoldingUsd", title: "ብድር ይጠይቁ", text: "ንብረትን ለማሳደግ ቀላል ብድር ይጠይቁ።" },
      { icon: "FaUniversity", title: "አንድነት ይኑሩ", text: "የፋይናንስ ድጋፍን እና ብቃት ይደርሱ።" },
    ],
    membershipCTA: "አባልነት ይመዝግቡ",

    // News Section
    newsTitle: "ዜናና ክስተቶች",
    newsSubtitle: "ከወርቃማ ሳኮ የቅርብ ጊዜ ማስታወቂያዎችን ይከታተሉ",
    newsNoItems: "አሁን ዜና የለም።",
    newsReadMore: "ተጨማሪ ንባብ",
    newsClose: "ዝጋ",

    // Contact Section
    contactTitle: "አግኙን",
    contactSuccess: "መልእክትዎ በተሳካ ሁኔታ ተልኳል!",
    contactError: "አንድ ነገር ተሳስቷል። እባክዎ ድጋሚ ይሞክሩ።",
    contactName: "ስም",
    contactEmail: "ኢሜይል",
    contactReason: "ምክንያት ይምረጡ",
    contactReasonOptions: ["ድጋፍ", "ጥያቄ", "አስተያየት", "ሌሎች"],
    contactMessage: "መልእክትዎ",
    contactSubmit: "መልእክት ይላኩ",
    contactSending: "በመላክ...",

    // Footer Section
    footer: {
      sacco: "ብድርና ቁጠባ",
      subtitle: "በአስተማማኝ ቁጠባዎች፣ በተመጣጣኝ ብድሮች እና በመላው ኢትዮጵያ ማህበረሰብን ያማከሩ አገልግሎቶችን በመጠቀም የወደፊት የፋይናንስ አቅምን ማጎልበት",
      subscribers: "ተመዝጋቢዎች",
      quickLinks: "ፈጣን አገናኝ",
      links: {
        home: "መነሻ",
        services: "አገልግሎቶች",
        news: "ዜናና ክስተቶች",
        contact: "አግኙን",
        join: "አባልነት ይመዝግቡ",
      },
      contactUs: "አግኙን",
      phone: "+251 912 345 678",
      email: "info@werqamasacco.et",
      newsletter: "ዜና ይዘው ይመዝገቡ",
      newsletterDesc: "የቅርብ ጊዜ ማስታወቂያዎችና የፋይናንስ ምክር ይቀበሉ።",
      subscribe: "ኢሜይልዎን ያስገቡ",
      subscribing: "በመመዝገብ...",
      copyright: `© ${new Date().getFullYear()} ወርቃማ ሳኮ. መብቶች ተጠበቁ። | በYourTeam ተሰርቷል`,
    },

  },
};

export default translations;
