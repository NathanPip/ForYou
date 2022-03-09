import React, { useState } from "react";
import Section from "./Section";
import Messages from "./Messages";

export default function Main() {
  //base url for image paths
  const [baseurl] = useState("images/");

  //img paths
  const [imgs] = useState({
    carousel1: [
      `${baseurl}L1.jpg`,
      `${baseurl}L2.jpg`,
      `${baseurl}L3.jpg`,
      `${baseurl}L5.jpg`,
      `${baseurl}L6.jpg`
    ],
    carousel2: [`${baseurl}P1.jpg`, `${baseurl}P2.jpg`, `${baseurl}P3.jpg`],
    carousel3: [`${baseurl}P4.jpg`, `${baseurl}P5.jpg`, `${baseurl}P6.jpg`]
  });
  
  return (
    <main className="main">
      <Messages />
      <Section images={imgs.carousel1}>
        <ul className="section__list">
          <li className="section__list__item">Nathan Loves Jenna</li>
          <li className="section__list__item">Jenna Loves Nathan</li>
          <li className="section__list__item">Nathan Loves Jenna</li>
          <li className="section__list__item">Jenna Loves Nathan</li>
        </ul>
      </Section>
      <Section images={imgs.carousel2}>
        <h3 className="section__title">I love you</h3>
        <p className="section__content__body">
          Jenna you mean the absolute world to me and I couldn't imagine life
          without you my sweets
        </p>
      </Section>
      <Section images={imgs.carousel3}>Never Forget {"<3"}</Section>
    </main>
  );
}
