import "./app.css";
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import { Main } from "./components/main";

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <InventrackRoutes />
            </BrowserRouter>
        </div>
    );
};

const InventrackRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Main  />} />
        </Routes>
    );
};

export default App;
