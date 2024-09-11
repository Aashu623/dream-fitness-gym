'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './Header';
import Stats from './Stats';
import bg1 from '@/assets/bg-1.jpg';
import bg2 from '@/assets/bg-2.jpg';
import bg3 from '@/assets/bg-3.jpg';
import bg4 from '@/assets/bg-4.jpg';

const images = [
    bg1, bg2, bg3, bg4
]; // Add your slideshow image paths here

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 3000); // Change slides every 3 seconds
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <section className="hero flex flex-col h-screen">
            {/* Header */}
            <Header />

            {/* Stats */}
            <Stats />

            {/* Slideshow */}
            <div className="flex-grow relative w-full overflow-hidden">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;
