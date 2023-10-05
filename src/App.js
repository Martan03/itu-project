import './css/DarkTheme.css';
import './css/Form.css';
import './css/Navbar.css';
import './css/App.css';
import Sidebar from "./navbar/Menu";
import Navbar from "./navbar/Navbar"

function App() {
    return (
        <div className="App">
            <Navbar />
            <Sidebar />
        </div>
    );
}

export default App;
