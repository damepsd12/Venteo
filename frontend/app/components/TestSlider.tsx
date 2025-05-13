'use client';

import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

export default function TestSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // 1 sur mobile
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768, // tablette
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 1024, // desktop
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  const slides = [
    {
      text: "Bienvenue sur Venteo – La marketplace pour tout vendre et tout trouver.",
      bg: "linear-gradient(to right, #fdfbfb, #ebedee)",
    },
    {
      text: "Rejoignez notre communauté d’acheteurs et de vendeurs dès aujourd’hui !",
      bg: "linear-gradient(to right, #ffecd2, #fcb69f)",
    },
    {
      text: "Des produits validés, des vendeurs de confiance, une expérience fluide.",
      bg: "linear-gradient(to right, #c9ffbf, #ffafbd)",
    },
    {
      text: "Venteo est en ligne — soyez parmi les premiers à en profiter !",
      bg: "linear-gradient(to right, #a1c4fd, #c2e9fb)",
    }
  ];

  return (
    <div className='px-4 md:px-16 py-8'>
      <h2 className='text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800'>
        Découvrez Venteo
      </h2>
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className='px-2'>
            <div
              className='h-48 md:h-52 lg:h-56 rounded-2xl shadow-lg flex items-center justify-center text-center px-6 text-lg md:text-xl font-medium text-gray-700'
              style={{ background: slide.bg }}
            >
              {slide.text}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
