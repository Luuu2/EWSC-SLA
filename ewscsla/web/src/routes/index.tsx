import {useRoutes} from "react-router";
import DashboardPage from "@/pages/dashboard";
import MainLayout from "@/layouts/MainLayout";
import CategoriesPage from "@/pages/categories";
import SlaEntryPage from "@/pages/sla-entry";
import {BASE_URL, CATEGORIES_URL, DASHBOARD_URL, ENTER_SLA_URL, RATE_SLA_URL} from "@/app/config";


export default function ThemeRoutes() {
    return useRoutes([{
        path: BASE_URL,
        element: <MainLayout/>,
        children: [
            {
                path: DASHBOARD_URL,
                element: <DashboardPage/>
            },

            {
                path: ENTER_SLA_URL,
                element: <SlaEntryPage/>
            },

            {
                path: CATEGORIES_URL,
                element: <CategoriesPage/>
            },
        ]
    }])
}