import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-gray-300 py-4 sm:py-10 border-t border-slate-800">
      <div className="container mx-auto text-center">
        <p className="text-xs sm:text-sm mb-1 sm:mb-2 px-2">© 2024 DevPlatform. All rights reserved.</p>
        <p className="text-sm mb-2 hidden sm:block px-2">
          <span className="font-semibold">About Us:</span> We are a platform dedicated to helping developers enhance their skills by completing frontend challenges and showcasing their work. Join us to learn, grow, and be inspired!
        </p>
        <p className="text-xs sm:text-sm mb-2 px-2">
          <span className="font-semibold">Contact:</span> For any inquiries or feedback, reach out to us at <a href="mailto:devInfo19@gmail.com" className="text-blue-400 hover:underline">devInfo19@gmail.com</a>
        </p>
        <p className="text-xs sm:text-sm px-2 ">
          <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a> | <a href="/terms-of-service" className="text-blue-400 hover:underline">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
