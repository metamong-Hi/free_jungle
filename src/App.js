import React from 'react';
import './App.css';
import ThreeCanvas from './three.jsx'; // ThreeCanvas 컴포넌트의 경로를 정확하게 지정해야 합니다.
import Room from './room.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IntroPage from './components/Intro.jsx';
import { RecoilRoot } from 'recoil';
function App() {
  return (
    <div className="App">
      <main>
        {/* ThreeCanvas 컴포넌트를 렌더링합니다. */}
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
          <Route path={"/ground"} element={<ThreeCanvas/>}></Route> 
              {/* <Route path={"/"} element={ <ThreeCanvas />}></Route> */}
              <Route path={"/room/:name"} element={<Room />}></Route> 
              <Route path={"/"} element={<IntroPage/>}></Route>        
          </Routes>
        </BrowserRouter>
        </RecoilRoot>
      </main>
    </div>
  );
}

export default App;