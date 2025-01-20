import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <div className="logo cursor-pointer font-">
    <Link to="/" className="font-light text-xl sm:text-2xl text-white">
     <span className='border-b-2 border-teal-500 '>chat</span><span className='text-teal-300'>App</span>
    </Link>
  </div>
);

export default Logo;
