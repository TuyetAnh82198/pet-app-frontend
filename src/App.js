import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Layout from "./components/RootLayout.jsx";
import Home from "./pages/Home.jsx";
import Page404 from "./pages/Page404.jsx";
import Page500 from "./pages/Page500.jsx";
import Breed from "./pages/Breed.jsx";
import Edit from "./pages/Edit.jsx";
import Search from "./pages/Search.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        { path: "/breed", element: <Breed /> },
        {
          path: "/edit",
          element: <Edit />,
        },
        { path: "/search", element: <Search /> },
        { path: "/server-error", element: <Page500 /> },
        { path: "*", element: <Page404 /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
