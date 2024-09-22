import ToolCard from './components/ToolCard';

export default function Home() {
  const tools = [
    {
      title: 'PNG to JPEG',
      description: 'Convert PNG images to JPEG format.',
      link: '/tools/image/png-to-jpeg',
    },
    {
      title: 'JPEG to PNG',
      description: 'Convert JPEG images to PNG format.',
      link: '/tools/image/jpeg-to-png',
    },
    {
      title: 'WebP to PNG',
      description: 'Convert WebP images to PNG format.',
      link: '/tools/image/webp-to-png',
    },
    {
      title: 'WebP to JPEG',
      description: 'Convert WebP images to JPEG format.',
      link: '/tools/image/webp-to-jpeg',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-grow"> 
        <h1 className="text-3xl font-bold mb-4">Micro-Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div className="tool-card" key={tool.title}>
              <ToolCard {...tool} /> 
            </div>
          ))}
        </div>
      </div>
      <footer className="text-center mt-8 p-4">
        Created by Hari Pritam
      </footer>
    </div>
  );
}
