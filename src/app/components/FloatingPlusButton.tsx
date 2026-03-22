import { Plus } from 'lucide-react';

export function FloatingPlusButton() {
  const handleClick = () => {
    window.open('https://calendar.google.com', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-7 bottom-6 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50"
      style={{
        background: 'linear-gradient(180deg, #8b5cf6 0%, #7c4dff 100%)',
        boxShadow: '0 18px 30px rgba(126, 78, 255, .32)',
      }}
      title="Add event"
    >
      <Plus className="size-8" strokeWidth={3} />
    </button>
  );
}
