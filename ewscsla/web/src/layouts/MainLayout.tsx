import Header from "@/layouts/Header";
import {Outlet} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster";

export default function MainLayout() {
    return (
        <main>
            {/* Header */}
            <Header/>

            {/* children components */}
            <div className="px-8 mt-8">
                <Outlet/>
            </div>

            <Toaster />

        </main>
    )
}