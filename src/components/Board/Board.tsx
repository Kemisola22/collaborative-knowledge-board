import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoardStore } from '../../stores/useBoardStore';
import { Column } from '../Column/Column';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function Board() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const board = useBoardStore((state) => state.boards[boardId!]);
  const boardColumns = useBoardStore((state) => state.boardColumns[boardId!]);
  const columnsObj = useBoardStore((state) => state.columns);
  const addColumn = useBoardStore((state) => state.addColumn);

  const columns = useMemo(() => {
    if (!boardColumns) return [];
    return boardColumns
      .map((id) => columnsObj[id])
      .filter(Boolean)
      .sort((a, b) => a.order - b.order);
  }, [boardColumns, columnsObj]);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');

  const sortedColumns = useMemo(() => {
    return [...columns].sort((a, b) => a.order - b.order);
  }, [columns]);

  if (!board) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Board not found</p>
          <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (columnTitle.trim()) {
      addColumn(boardId!, columnTitle.trim());
      setColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" onClick={() => navigate('/')} className="px-2 py-0.5 text-gray-700 hover:text-gray-900 focus:ring-0"
               aria-label="Back todashboard">
             
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"  viewBox="0 0 24 24" stroke="currentColor"strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </Button>
              <h1 className="text-xl font-bold text-gray-900">{board.title}</h1>
            </div>
            {board.description && (
              <p className="text-gray-600 text-sm mt-1 ml-20">{board.description}</p>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-4 h-full"> {sortedColumns.map((column) => ( <Column key={column.id} column={column} />
          ))}

          <div className="w-80 flex-shrink-0">
            {isAddingColumn ? (
              <form onSubmit={handleAddColumn} className="bg-gray-100 rounded-lg p-4">
               <Input value={columnTitle}  onChange={(e) => setColumnTitle(e.target.value)} placeholder="Enter column title..." autoFocus aria-label="New column title"/>
                <div className="flex gap-2 mt-3">
                  <Button type="submit" className="text-sm px-3 py-1">Add Column</Button>
                  <Button type="button" variant="secondary" onClick={() => {
                      setIsAddingColumn(false);
                      setColumnTitle('');
                    }}
                    className="text-sm px-3 py-1" >Cancel</Button>
                </div>
              </form>
            ) : (
              <Button  variant="secondary" onClick={() => setIsAddingColumn(true)}  className="w-full" aria-label="Add new column">+ Add Column</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}