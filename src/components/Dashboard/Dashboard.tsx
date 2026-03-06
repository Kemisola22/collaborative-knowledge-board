import { useState, useMemo, useRef, useEffect } from 'react';
import { useBoardStore } from '../../stores/useBoardStore';
import { BoardCard } from './BoardCard';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function Dashboard() {
  const boardsObj = useBoardStore((state) => state.boards);
  const addBoard = useBoardStore((state) => state.addBoard);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  
  const boards = Object.values(boardsObj);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      titleRef.current?.focus();
    }
  }, [isModalOpen]);

  const sortedBoards = useMemo(() => {
    return [...boards].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [boards]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addBoard(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
        <Button onClick={() => setIsModalOpen(true)} aria-label="Create new board">
          + New Board
        </Button>
      </div>

      {sortedBoards.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No boards yet</p>
          <Button onClick={() => setIsModalOpen(true)}>Create your first board</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBoards.map((board) => (
            <BoardCard key={board.id} board={board} onDelete={deleteBoard} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Board"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Board Title"
            id="board-title"
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Marketing Ideas"
            required
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="board-description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="board-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this board for?"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            />
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Board</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}