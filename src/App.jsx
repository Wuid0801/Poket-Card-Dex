import { useState } from 'react'
import { lazy, Suspense } from "react";

import './App.css'

function App() {
  const PoketDexTemplate = lazy(() => import('./components/poketDexTemplate'))
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PoketDexTemplate />
      </Suspense>
    </>
  )
}

export default App
