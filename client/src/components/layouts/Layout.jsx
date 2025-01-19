import React from 'react'

// import { Helmet } from "react-helmet";
import Navbar from './Navbar';
import Footer from './Footer'



const Layout = ({ children}) => {
    return (
        <div>
            {/* <Helmet>
                <meta charSet="utf-8" />

                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={auther} />

                <title>{title}</title>
            </Helmet> */}
            <Navbar/>
            <main>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
