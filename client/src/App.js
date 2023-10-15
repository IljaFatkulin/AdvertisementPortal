import './App.css';
import AppRouter from "./components/AppRouter";
import {BrowserRouter} from "react-router-dom";
import './animations.css';
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
        <BrowserRouter>
            <AppRouter>
            </AppRouter>
        </BrowserRouter>
    </div>
  );
}

export default App;
