import {useRoutes} from "react-router";
import DashboardPage from "@/pages/dashboard";
import MainLayout from "@/layouts/MainLayout";
import ImprovementActionPlan from "@/pages/improvement-action-plan";
import SlaEntryPage from "@/pages/sla-entry";
import {BASE_URL, IMPROVEMENT_ACTION_PLAN_URL, DASHBOARD_URL, ENTER_SLA_URL, REPORTS_URL, EMAILS_URL} from "@/app/config";
import Reports from "@/pages/reports";
import Emails from "@/pages/emails";
import NotFoundLayout from "@/layouts/NotFoundLayout";


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
                path: IMPROVEMENT_ACTION_PLAN_URL,
                element: <ImprovementActionPlan/>
            },

            {
                path: REPORTS_URL,
                element: <Reports/>
            },

            {
                path: EMAILS_URL,
                element: <Emails/>
            },
        ]
    }, {
        path: '*',
        element: <NotFoundLayout/>
    }])
}