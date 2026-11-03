import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home.tsx";
import SamplePage from "./pages/SamplePage.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sample-page" element={<SamplePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
