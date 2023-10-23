import Hero from "./components/Hero";
import Demo from "./components/Demo";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

const App = () => {
  return (
    <Router>
      <main>
        <div className="main">
          <div className="gradient"></div>
        </div>

        <div className="app">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
};

export default App;
