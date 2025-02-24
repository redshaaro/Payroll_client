import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Entriespage from "./pages/Entriespage";

function App() {


  return (

    <Router>
      <Routes>
        <Route path="/Entries" element={<Entriespage />} />

      </Routes>
    </Router>



  )
}

export default App
