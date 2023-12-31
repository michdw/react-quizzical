import React from "react";

export default function shape(props) {
  const upto = (max) => ~~(Math.random() * max);

  const styles = [
    {
      bottom: `${upto(70)}%`,
      left: `${upto(70)}%`,
      transform: `translate(-${upto(50)}%, ${upto(50)}%) rotate(${upto(360)}deg)`,
    },
    {
      top: `${upto(70)}%`,
      right: `${upto(70)}%`,
      transform: `translate(${upto(50)}%, -${upto(50)}%) rotate(${upto(360)}deg)`,
    },
  ];
  const fillColors = ["#DEEBF8", "#FFFAD1"];

  return (
    <svg
      className="Shape"
      style={{ ...styles[props.index] }}
      width={window.innerWidth * 0.9}
      height={window.innerHeight * 0.9}
      viewBox="0 0 201 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M97.081 2.96445C125.176 1.07254 156.497 -5.87426 176.843 11.5469C199.363 30.8293 205.928 62.0589 197.414 88.8747C189.338 114.313 164.282 132.992 135.909 140.475C112.024 146.775 90.3937 132.093 67.6086 123.11C43.0847 113.441 10.3944 110.575 2.2058 87.7612C-6.33319 63.9714 11.3227 39.0277 31.0878 21.3621C48.2313 6.03978 72.9064 4.59238 97.081 2.96445Z"
        fill={fillColors[props.index]}
      />
    </svg>
  );
}
