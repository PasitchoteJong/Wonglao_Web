import { Component } from "react";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider
} from "react-router-dom";
import Home from "../pages/Home.jsx";
import RegisterLine from "../pages/RegisterLine.jsx"


const router = createBrowserRouter([
    // { path: "/Register",Component:Register }
    { path: "/register", element: <RegisterLine /> },
    { path: "/", element: <Home /> },
    { path: "*", element: <Navigate to="/" replace /> }

])

export default function AppRouter() {
    return <RouterProvider router={router} />
}