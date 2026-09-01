import { Component } from "react";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider
} from "react-router-dom";
import Home from "../pages/Home.jsx";
import RegisterLine from "../pages/RegisterLine.jsx"
import LoginLine from "../pages/LoginLine.jsx";


const router = createBrowserRouter([
    // { path: "/Register",Component:Register }
    { path: "/loginline", element: <LoginLine /> },
    { path: "/register", element: <RegisterLine /> },
    { path: "/", element: <Home /> },
    { path: "*", element: <Navigate to="/" replace /> }

])

export default function AppRouter() {
    return <RouterProvider router={router} />
}