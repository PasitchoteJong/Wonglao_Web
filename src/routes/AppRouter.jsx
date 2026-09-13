import { Component } from "react";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider
} from "react-router-dom";

import Home from "../pages/Home.jsx";
import RegisterLine from "../pages/RegisterLine.jsx"
import LoginLine from "../pages/LoginLine.jsx";
import CreateBill from "../pages/CreateBill";
import VerifyBill from "../pages/VerifyBill.jsx";
import FoodSplitting from "../pages/FoodSplitting.jsx";
import RussianRoulette from "../pages/RRoulette.jsx";
import BillSummary from "../pages/BillSummary.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import LoginSuccess from "../pages/LoginSuccess.jsx";
import JoinBill from "../pages/JoinBill.jsx";


const router = createBrowserRouter([
    // { path: "/Register",Component:Register }
    { path: "/loginline", element: <LoginLine /> },
    { path: "/register-line", element: <RegisterLine /> },
    { path: "/login-success", element: <LoginSuccess /> },
    { path: "/", element: <Home /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: "/create-bill", element: <CreateBill /> },
            { path: "/verify-bill/:billId", element: <VerifyBill /> },
            {path:"/join-bill/:billId",element:<JoinBill/>},
            { path: "/food-splitting/:billId", element: <FoodSplitting /> },
            { path: "/food-splitting/:billId/summary", element: <BillSummary /> },
            { path: "/r-roulette", element: <RussianRoulette /> }

        ]
    },

    { path: "*", element: <Navigate to="/" replace /> }

])

export default function AppRouter() {
    return <RouterProvider router={router} />
}