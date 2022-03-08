import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

// prevent index out of bounds
const indexChange = (index, delta, amt) => {
  return (((index + delta) % amt) + amt) % amt;
};

export default function Carousel({ images }) {
    //references to all the images within the carousel
  const imgRefs = useRef([]);
  //current index within imgRefs of displayed image
  const [currentIndex, setCurrentIndex] = useState(0);

//sets an interval which swaps displayed images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex(prev => indexChange(prev, 1, imgRefs.current.length)), 5000);
    slideImg(1);
    return () => clearInterval(interval);
  }, [currentIndex]);

  //sets the first index within imgRefs to the selected image once page has been drawn
  useLayoutEffect(() => {
    if (imgRefs.length) imgRefs[0].classList.add("carousel__item--selected");
  }, [])

  //maps the paths in images to img elements and returns the array
  const renderImages = () => {
    return images.map((img, index) => {
      return (
        <img
          className="carousel__item"
          key={`${index} + ${img}`}
          src={img}
          ref={el => (imgRefs.current[index] = el)}
        />
      );
    });
  };

  //slides the images to the next or previous image based on delta value (1 or -1)
  function slideImg (delta){
    imgRefs.current.forEach(img => img.classList.remove("carousel__item--selected"));
    imgRefs.current[currentIndex].classList.add(
      "carousel__item--selected"
    );
  }

  return (
    <div className="carousel">
      <button
        className="carousel__button button--left"
        onClick={() => setCurrentIndex(prev => indexChange(prev, -1, imgRefs.current.length))}
      >{'<'}</button>
      <div className="carousel__images">{renderImages()}</div>
      <button
        className="carousel__button button--right"
        onClick={() => setCurrentIndex(prev => indexChange(prev, 1, imgRefs.current.length))}
      >{'>'}</button>
    </div>
  );
}
