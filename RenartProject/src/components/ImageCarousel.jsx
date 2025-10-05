import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ImageCarousel.css';

const ImageCarousel = ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const imageUrls = Object.values(images);
    const colors = Object.keys(images);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="carousel">
            <div
                className="carousel-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >

                <div className="carousel-slide">
                    <img
                        src={imageUrls[currentIndex]}
                        alt={`${productName} - ${colors[currentIndex]} gold`}
                        className="carousel-image"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400/ffffff/666666?text=Resim+Yok';
                        }}
                    />
                </div>

            </div>

            <div className="carousel-dots">
                {imageUrls.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        style={{
                            backgroundColor:
                                colors[index] === 'white' ? '#D9D9D9' :
                                    colors[index] === 'yellow' ? '#E6CA97' : '#E1A4A9'
                        }}
                    />
                ))}
            </div>

            <div className="color-labels">
                {colors.map((color, index) => (
                    index === currentIndex && (
                        <span
                            key={color}
                            className="color-label-text"
                        >
                            {color === 'white' ? 'Beyaz Altın' :
                                color === 'yellow' ? 'Sarı Altın' : 'Pembe Altın'}
                        </span>
                    )
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;