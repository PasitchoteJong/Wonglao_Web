import { Component } from "react";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider
} from "react-router-dom";
import Home from "../pages/Home";


const router = createBrowserRouter([
    // { path: "/Register",Component:Register }
    { path: "/", element:<Home /> },
    { path: "*", element: <Navigate to="/" replace /> }

])

export default function AppRouter() {
    return <RouterProvider router={router} />
}