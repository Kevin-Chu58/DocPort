import Home from './views/Home';
import Login from './views/Login';

const routes = [
    // Route order must be from most specific to least specific (i.e. `/user/:username` before `/user`)
    {
        name: "Home",
        path: "/",
        element: <Home page="docs" />,
    },
    {
        name: "Bin",
        path: "/bin",
        element: <Home page="bin" />,
    },
    {
        name: "Login",
        path: "/login",
        element: <Login />,
    },
];

export default routes;