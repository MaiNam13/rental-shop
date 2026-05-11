import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../components/home/HeroSection'
import CategoriesSection from '../components/home/CategoriesSection'
import FeaturedProductsSection from '../components/home/FeaturedProductsSection'
import WhyChooseUsSection from '../components/home/WhyChooseUsSection'
import TestimonialsSection from '../components/home/TestimonialsSection'
import Footer from '../components/layout/Footer'

const HomePage = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <CategoriesSection />
                <FeaturedProductsSection />
                <WhyChooseUsSection />
                <TestimonialsSection />
            </main>
            <Footer />
        </>
    )
}

export default HomePage
