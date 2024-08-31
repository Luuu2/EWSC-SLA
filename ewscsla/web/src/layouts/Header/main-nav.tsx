import React from "react";
import {cn} from "@/lib/utils"
import {Link, useLocation} from "react-router-dom";
import {ENTER_SLA_URL, DASHBOARD_URL, CATEGORIES_URL} from "@/app/config";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu, Package2} from "lucide-react";
import Logo from "@/layouts/Header/Logo";

const routes = [
    {
        url: DASHBOARD_URL,
        route: "Dashboard",
    },
    {
        url: ENTER_SLA_URL,
        route: "SLA-Entry",
    },
    {
        url: CATEGORIES_URL,
        route: "Manager-Status",
    },
    {
        url: CATEGORIES_URL,
        route: "Customer-Status",
    }
]

export function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {

    const {pathname} = useLocation();

    return (
        <header className="sticky top-0 z-50">
            <nav
                className={cn("hidden md:flex items-center space-x-4 lg:space-x-6", className)}
                {...props}
            >
                <Logo/>

                {
                    routes.map((route, index) => {
                        return (
                            <Link
                                key={index}
                                to={route.url}
                                className={cn(
                                    "hidden lg:block text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                                    (pathname === route.url) && "text-primary"
                                )}
                            >
                                {route.route}
                            </Link>
                        )
                    })
                }
            </nav>

            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            to="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6"/>
                            <span className="sr-only">EWSC SLA</span>
                        </Link>
                        <Link to="#" className="hover:text-foreground">
                            Dashboard
                        </Link>
                        <Link
                            to="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Orders
                        </Link>
                        <Link
                            to="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Products
                        </Link>
                        <Link
                            to="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Customers
                        </Link>
                        <Link
                            to="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Analytics
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

        </header>
    )
}
