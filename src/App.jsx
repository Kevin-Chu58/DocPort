import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes";
import Header from "./Header";
import "./App.css";

function App() {
    return (
        <div className="_ vw100 vh100 overflow-hidden scrollbar">
            <Router>
                <div className="block column">
                    <Header />

                    <div className="block main white-bg">
                        <main>
                            <Routes>
                                {routes.map((route) => (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        element={route.element}
                                    />
                                ))}
                            </Routes>
                        </main>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;
