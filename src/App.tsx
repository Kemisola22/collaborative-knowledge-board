import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Dashboard from './components/Dashboard/Dashboard.tsx';

const Board = lazy(() => import('./components/Board/Board.tsx'));

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/board/:boardId" element={<Board />}/>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;