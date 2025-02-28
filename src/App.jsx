import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Sidebar from "./components/Sidebar/Sidebar";
import EntriesPage from "./pages/Entriespage";
import Home from "./pages/Home";
import theme from "./config/theme";

function App() {
  return (
      <ThemeProvider theme={theme}>
        <Router>
          <div style={{ display: "flex" }}>
            <Sidebar />
            <main
              style={{
                flexGrow: 1,
                padding: "20px",
                background: "linear-gradient(#f5f5f5, #eaeaea)", // Light Gradient
                height: "100vh",
              }}
            >
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/uploader" element={<EntriesPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
  );
}

export default App;
