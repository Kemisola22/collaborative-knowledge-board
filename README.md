# Collaborative Knowledge Board

A production-grade task management application simulating a real SaaS product for fast-moving teams.

**Live Demo:**https://kemi-knowledge-board.netlify.app 
**GitHub:** https://github.com/Kemisola22/collaborative-knowledge-board

## Project Overview

This is Stage 1 of a multi-stage collaborative workspace tool, focusing on core board functionality with clean architecture, strong state management, and accessible UI.

## Features

- **Board Management:** Create, view, and delete multiple project boards
- **Column Organization:** Add and manage columns for task categorization
- **Card System:** Create cards with markdown descriptions, tags, and due dates
- **Markdown Support:** Full markdown rendering with GitHub-flavored markdown
- **Keyboard Navigation:** Complete keyboard accessibility (Tab, Enter, Escape)
- **Performance Optimized:** Memoization and code splitting for optimal rendering

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling and development
- **Zustand** for state management
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **React Markdown** with remark-gfm for markdown parsing

## State Architecture

### Normalized State Structure

The application uses a normalized, flat state structure for optimal performance and scalability:
```typescript
{
  boards: { [id: string]: Board },
  columns: { [id: string]: Column },
  cards: { [id: string]: Card },
  boardColumns: { [boardId: string]: string[] },
  columnCards: { [columnId: string]: string[] }
}
```

**Why This Architecture?**

1. **No Deep Nesting:** Entities stored flat by ID prevents nested update complexity
2. **Fast Lookups:** O(1) access to any entity by ID
3. **Prevents Prop Drilling:** Components access store directly via selectors
4. **Scalable for Real-Time:** Structure supports WebSocket updates in Stage 2
5. **Efficient Re-renders:** Only affected components re-render on state changes

**State Flow Example:**
```
User deletes a board
  ↓
Store removes board by ID
  ↓
Store finds all column IDs for that board (boardColumns lookup)
  ↓
Store removes each column
  ↓
Store finds all card IDs for each column (columnCards lookup)
  ↓
Store removes all cards
  ↓
Cascade delete complete in O(n) time
```

## Project Structure

src/
├── components/
│   ├── Board/
│   │   └── Board.tsx          # Main kanban board view
|   ├── Card/
│   │   └── Card.tsx           # Task card with edit modal
│   ├── Column/
│   │   └── Column.tsx         # Column container with card list
|   ├── Dashboard/
│   │   ├── Dashboard.tsx      # Board list view with CRUD
│   │   └── BoardCard.tsx      # Individual board card component
│   └── ui/
│       ├── Button.tsx         # Reusable button component
│       ├── Input.tsx          # Reusable input component
│       └── Modal.tsx          # Accessible modal with focus trap
├── stores/
│   └── useBoardStore.ts       # Zustand store with normalized state
├── types/
│   └── index.ts               # TypeScript interfaces
└── App.tsx                     # Router and lazy loading setup
```

## Performance Strategy

### 1. Component Memoization
- All components wrapped in `React.memo` to prevent unnecessary re-renders
- Components only re-render when their specific props change

### 2. Selector Optimization
```typescript
const columns = useBoardStore((state) => state.getColumnsByBoardId(boardId));
```

### 3. Callback Memoization
- `useCallback` used for event handlers passed as props
- Prevents child component re-renders due to new function references

### 4. Code Splitting
```typescript
const Board = lazy(() => import('./components/Board/Board'));
```
- Board component loaded only when needed
- Reduces initial bundle size

### 5. Computed Values
- `useMemo` for sorted/filtered data
- Prevents recalculation on every render

## Accessibility Features

- **Semantic HTML:** Proper heading hierarchy and landmarks
- **ARIA Labels:** Descriptive labels on all interactive elements
- **Keyboard Navigation:**
  - Tab: Navigate between elements
  - Enter/Space: Activate buttons and cards
  - Escape: Close modals
- **Focus Management:** Focus trapped in modals, returns to trigger on close
- **Screen Reader Support:** All actions announced properly

## Key Engineering Decisions

### Why Zustand Over Context API?
- **Performance:** Components only re-render when their selected state changes
- **No Provider Hell:** Direct store access without wrapping components
- **Simple API:** Less boilerplate than Redux, more scalable than Context
- **DevTools Support:** Easy debugging with browser extensions

### Why Normalized State?
- Prevents deep nested updates that cause performance issues
- Easier to sync with backend in Stage 2 (real-time updates)
- Follows Redux best practices for state shape
- Makes data mutations predictable and traceable

### Why No Drag-and-Drop in Stage 1?
- Requirements explicitly state no drag-and-drop libraries in Stage 1
- Focus on core architecture, state management, and accessibility first

## Installation & Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

- Chrome/Edge (latest)


---

**Built by Kemi** | [GitHub](https://github.com/Kemisola22) 