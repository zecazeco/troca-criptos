import { HTMLAttributes } from 'react';

function Card({ className = '', ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`card ${className}`.trim()} {...props} />;
}

export default Card;
