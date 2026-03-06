import { create } from 'zustand';
import type { Board, Column, Card } from '../types';

interface BoardState {
  boards: Record<string, Board>;
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  boardColumns: Record<string, string[]>;
  columnCards: Record<string, string[]>;
  
  addBoard: (title: string, description: string) => void;
  deleteBoard: (boardId: string) => void;
  
  addColumn: (boardId: string, title: string) => void;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;
  
  addCard: (columnId: string, card: Omit<Card, 'id' | 'columnId'>) => void;
  updateCard: (cardId: string, updates: Partial<Omit<Card, 'id' | 'columnId'>>) => void;
  deleteCard: (cardId: string) => void;
  
  getBoardById: (boardId: string) => Board | undefined;
  getColumnsByBoardId: (boardId: string) => Column[];
  getCardsByColumnId: (columnId: string) => Card[];
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: {},
  columns: {},
  cards: {},
  boardColumns: {},
  columnCards: {},

  addBoard: (title, description) => {
    const id = `board-${Date.now()}`;
    set((state) => ({
      boards: {
        ...state.boards,
        [id]: {
          id,
          title,
          description,
          createdAt: new Date().toISOString(),
        },
      },
      boardColumns: {
        ...state.boardColumns,
        [id]: [],
      },
    }));
  },

  deleteBoard: (boardId) => {
    set((state) => {
      const newBoards = { ...state.boards };
      const newColumns = { ...state.columns };
      const newCards = { ...state.cards };
      const newBoardColumns = { ...state.boardColumns };
      const newColumnCards = { ...state.columnCards };

      delete newBoards[boardId];

      const columnIds = state.boardColumns[boardId] || [];
      columnIds.forEach((columnId) => {
        delete newColumns[columnId];
        
        const cardIds = state.columnCards[columnId] || [];
        cardIds.forEach((cardId) => {
          delete newCards[cardId];
        });
        delete newColumnCards[columnId];
      });
      delete newBoardColumns[boardId];

      return {
        boards: newBoards,
        columns: newColumns,
        cards: newCards,
        boardColumns: newBoardColumns,
        columnCards: newColumnCards,
      };
    });
  },

  addColumn: (boardId, title) => {
    const id = `column-${Date.now()}`;
    set((state) => {
      const currentColumns = state.boardColumns[boardId] || [];
      return {
        columns: {
          ...state.columns,
          [id]: {
            id,
            boardId,
            title,
            order: currentColumns.length,
          },
        },
        boardColumns: {
          ...state.boardColumns,
          [boardId]: [...currentColumns, id],
        },
        columnCards: {
          ...state.columnCards,
          [id]: [],
        },
      };
    });
  },

  updateColumn: (columnId, title) => {
    set((state) => ({
      columns: {
        ...state.columns,
        [columnId]: {
          ...state.columns[columnId],
          title,
        },
      },
    }));
  },

  deleteColumn: (columnId) => {
    set((state) => {
      const column = state.columns[columnId];
      if (!column) return state;

      const newColumns = { ...state.columns };
      const newCards = { ...state.cards };
      const newBoardColumns = { ...state.boardColumns };
      const newColumnCards = { ...state.columnCards };

      delete newColumns[columnId];

      const cardIds = state.columnCards[columnId] || [];
      cardIds.forEach((cardId) => {
        delete newCards[cardId];
      });
      delete newColumnCards[columnId];

      newBoardColumns[column.boardId] = newBoardColumns[column.boardId].filter(
        (id) => id !== columnId
      );

      return {
        columns: newColumns,
        cards: newCards,
        boardColumns: newBoardColumns,
        columnCards: newColumnCards,
      };
    });
  },

  addCard: (columnId, card) => {
    const id = `card-${Date.now()}`;
    set((state) => {
      const currentCards = state.columnCards[columnId] || [];
      return {
        cards: {
          ...state.cards,
          [id]: {
            ...card,
            id,
            columnId,
          },
        },
        columnCards: {
          ...state.columnCards,
          [columnId]: [...currentCards, id],
        },
      };
    });
  },

  updateCard: (cardId, updates) => {
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: {
          ...state.cards[cardId],
          ...updates,
        },
      },
    }));
  },

  deleteCard: (cardId) => {
    set((state) => {
      const card = state.cards[cardId];
      if (!card) return state;

      const newCards = { ...state.cards };
      const newColumnCards = { ...state.columnCards };

      delete newCards[cardId];
      newColumnCards[card.columnId] = newColumnCards[card.columnId].filter(
        (id) => id !== cardId
      );

      return {
        cards: newCards,
        columnCards: newColumnCards,
      };
    });
  },

  getBoardById: (boardId) => get().boards[boardId],

  getColumnsByBoardId: (boardId) => {
    const columnIds = get().boardColumns[boardId] || [];
    return columnIds
      .map((id) => get().columns[id])
      .filter(Boolean)
      .sort((a, b) => a.order - b.order);
  },

  getCardsByColumnId: (columnId) => {
    const cardIds = get().columnCards[columnId] || [];
    return cardIds.map((id) => get().cards[id]).filter(Boolean);
  },
}));