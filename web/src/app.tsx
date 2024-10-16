import './app.css'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'
import React from 'react'
import { Main } from './components/main'

const App: () => React.ReactElement = () => {
  return (
    <div>
      <BrowserRouter>
        <InventrackRoutes />
      </BrowserRouter>
    </div>
  )
}

const InventrackRoutes: () => React.ReactElement = () => {
  return (
    <Routes>
      <Route path='/' element={<Main />} />
    </Routes>
  )
}

export default App
