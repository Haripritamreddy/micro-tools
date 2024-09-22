// src/app/components/ToolCard.tsx
import Link from 'next/link';

interface ToolCardProps {
  title: string;
  description: string;
  link: string;
}

export default function ToolCard({ title, description, link }: ToolCardProps) {
    return (
      <Link 
        href={link} 
        className="bg-white rounded-lg shadow-md no-underline text-black" 
      >
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </Link>
    );
  }