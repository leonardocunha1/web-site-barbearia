/**
 * Home feature types
 */

export interface ServiceCard {
  id: number;
  title: string;
  description: string;
  image: string;
  position?: string;
  icon?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
  rating: number;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  cta: {
    text: string;
    href: string;
  };
}
