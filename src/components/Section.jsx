import React from "react";
import Carousel from "./Carousel";

export default function Section({ children, images }) {
  return (
    <div className="section">
      <div className="section__content">{children}</div>
      <Carousel images={images} />
    </div>
  );
}
