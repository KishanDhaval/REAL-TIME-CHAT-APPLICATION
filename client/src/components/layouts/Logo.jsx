import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => (
  <div className="logo cursor-pointer font-">
    <Link to="/" className=" text-xl font-medium  sm:text-2xl text-zinc-950">
     <span className='border-b-2  border-sky-400  '>chat</span><span className='text-sky-400'>App</span>
    </Link>
  </div>
);

export default Logo;
