# Collaborative Knowledge Board

Built by Oluwakemi

A production-grade task management application built with React, TypeScript, and Zustand.

## Features

- Create and manage multiple boards
- Add columns to organize tasks
- Create cards with markdown descriptions, tags, and due dates
- Full keyboard navigation and accessibility support
- Performance optimized with memoization and code splitting

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Zustand** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **React Markdown** for markdown rendering

## State Architecture

The application uses a normalized state structure for optimal performance:

- Entities (boards, columns, cards) stored by ID in flat objects
- Lookup tables for relationships (boardColumns, columnCards)
- Prevents prop drilling and unnecessary re-renders
- Scalable architecture ready for real-time sync

## Run Locally
```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Project Structure
```
src/
├── components/
│   ├──Board/     # Kanban board view
│   ├── Card/         #Individual task card
│   ├── Column/        # Column with cards
│   ├── Dashoard/          # Board list and creatio
│   └── ui/            # Reusable UI components
├── stores/            # Zustand store
├── types/             # TypeScript interfaces
└── utils/             # Helper functions
```

## Performance Features

- React.memo for component memoization
- useMemo and useCallback for expensive operations
- Code splitting with React.lazy for Board component
- Normalized state prevents deep nested updates

## Accessibility

- Semantic HTML throughout
- ARIA labels on interactive elements
- Full keyboard navigation (Tab, Enter, Escape)
- Focus management in modals
- Screen reader friendly

## State Management Decision

Zustand was chosen over Context API and Redux because:

- Minimal boilerplate compared to Redux
- Better performance than Context (components only re-render when their data changes)
- Simple API that's easy to understand and maintain
- Scales well when adding real-time features