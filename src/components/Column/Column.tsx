import { useState, memo, useCallback, useMemo } from 'react';
import type { Column as ColumnType } from '../../types';
import { useBoardStore } from '../../stores/useBoardStore';
import { Card } from '../Card/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ColumnProps {
  column: ColumnType;
}

export const Column = memo(({ column }: ColumnProps) => {
  const columnCards = useBoardStore((state) => state.columnCards[column.id]);
  const cardsObj = useBoardStore((state) => state.cards);
  const updateColumn = useBoardStore((state) => state.updateColumn);
  const deleteColumn = useBoardStore((state) => state.deleteColumn);
  const addCard = useBoardStore((state) => state.addCard);

  const cards = useMemo(() => {
    if (!columnCards) return [];
    return columnCards.map((id) => cardsObj[id]).filter(Boolean);
  }, [columnCards, cardsObj]);

  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');

  const handleUpdateTitle = useCallback(() => {
    if (columnTitle.trim() && columnTitle !== column.title) {
      updateColumn(column.id, columnTitle.trim());
    }
    setIsEditing(false);
  }, [column.id, column.title, columnTitle, updateColumn]);

  const handleDeleteColumn = useCallback(() => {
    if (confirm(`Delete column "${column.title}" and all its cards?`)) {
      deleteColumn(column.id);
    }
  }, [column.id, column.title, deleteColumn]);

  const handleAddCard = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (cardTitle.trim()) {
      addCard(column.id, {
        title: cardTitle.trim(),
        description: '',
        tags: [],
        dueDate: null,
      });
      setCardTitle('');
      setIsAddingCard(false);
    }
  }, [column.id, cardTitle, addCard]);

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-80 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <input type="text" value={columnTitle} onChange={(e) => setColumnTitle(e.target.value)} onBlur={handleUpdateTitle} onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle();
              if (e.key === 'Escape') {
                setColumnTitle(column.title);
                setIsEditing(false);
              }
            }}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold" autoFocus aria-label="Edit column title"/>
        ) : (
          <h3
            className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600" onClick={() => setIsEditing(true)}  role="button" tabIndex={0} onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsEditing(true);
              }
            }}
            aria-label={`Column ${column.title}, click to edit`} > {column.title}
          </h3>
        )}
        <button onClick={handleDeleteColumn} className="text-gray-500 hover:text-red-600 transition-colors"  aria-label={`Delete column ${column.title}`}> ×</button>
      </div>

      <div className="space-y-3 mb-3">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      {isAddingCard ? (
        <form onSubmit={handleAddCard} className="space-y-2">
          <Input value={cardTitle}  onChange={(e) => setCardTitle(e.target.value)} placeholder="Enter card title..." autoFocus aria-label="New card title"/>
          <div className="flex gap-2">
            <Button type="submit" className="text-sm px-3 py-1">Add</Button>
            <Button type="button" variant="secondary" onClick={() => {
                setIsAddingCard(false);
                setCardTitle('');
              }}
              className="text-sm px-3 py-1" >Cancel</Button>
          </div>
        </form>
      ) : (
        <Button variant="secondary" onClick={() => setIsAddingCard(true)} className="w-full text-sm"  aria-label="Add new card">+ Add Card</Button>
      )}
    </div>
  );
});

Column.displayName = 'Column';