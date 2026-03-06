import type { Card as CardType } from '../../types';
import { useState, memo, useCallback } from 'react';
import { useBoardStore } from '../../stores/useBoardStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CardProps {
  card: CardType;
}

export const Card = memo(({ card }: CardProps) => {
  const updateCard = useBoardStore((state) => state.updateCard);
  const deleteCard = useBoardStore((state) => state.deleteCard);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [tags, setTags] = useState(card.tags.join(', '));
  const [dueDate, setDueDate] = useState(card.dueDate || '');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    updateCard(card.id, {
      title: title.trim(),
      description: description.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      dueDate: dueDate || null,
    });
    setIsModalOpen(false);
  }, [card.id, title, description, tags, dueDate, updateCard]);

  const handleDelete = useCallback(() => {
    if (confirm(`Delete card "${card.title}"?`)) {
      deleteCard(card.id);
      setIsModalOpen(false);
    }
  }, [card.id, card.title, deleteCard]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsModalOpen(true)} role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
        aria-label={`Open card ${card.title}`}
      >
        <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>
        {card.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {card.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded" > {tag} </span>
            ))}
          </div>
        )}
        {card.dueDate && (
          <p className="text-xs text-gray-500">  Due: {new Date(card.dueDate).toLocaleDateString()} </p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Card" >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title"  id="card-title"  value={title} onChange={(e) => setTitle(e.target.value)} required  autoFocus />
          
          <div className="flex flex-col gap-1">
            <label htmlFor="card-description" className="text-sm font-medium text-gray-700"> Description (Markdown supported)  </label>
            <textarea id="card-description" value={description} onChange={(e) => setDescription(e.target.value)}  placeholder="Add description with **bold**, *italic*, lists..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] font-mono text-sm"/>
          </div>

          {description && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {description}
                </ReactMarkdown>
              </div>
            </div>
          )}

          <Input  label="Tags (comma separated)" id="card-tags" value={tags} onChange={(e) => setTags(e.target.value)}  placeholder="urgent, frontend, bug"/>

          <Input   label="Due Date"  id="card-duedate"  type="date"  value={dueDate}  onChange={(e) => setDueDate(e.target.value)}/>

          <div className="flex gap-3 justify-between pt-4">
            <Button type="button" variant="danger" onClick={handleDelete}> Delete Card</Button>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}> Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
});

Card.displayName = 'Card';