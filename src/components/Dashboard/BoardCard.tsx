import type { Board } from '../../types';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

interface BoardCardProps {
  board: Board;
  onDelete: (id: string) => void;
}

export const BoardCard = memo(({ board, onDelete }: BoardCardProps) => {
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${board.title}"? This will delete all columns and cards.`)) {
      onDelete(board.id);
    }
  };

  return (
    <div  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/board/${board.id}`)} role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/board/${board.id}`);
        }
      }}
      aria-label={`Open board ${board.title}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{board.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500"> Created {new Date(board.createdAt).toLocaleDateString()} </span>
        <Button variant="danger"  onClick={handleDelete} className="text-sm px-3 py-1"  aria-label={`Delete board ${board.title}`}>  Delete </Button>
      </div>
    </div>
  );
});

BoardCard.displayName = 'BoardCard';