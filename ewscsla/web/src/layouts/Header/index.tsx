import {useEffect, useState} from "react";
import {MainNav} from "@/layouts/Header/main-nav";
import {Search} from "@/pages/dashboard/utils/search";
import {Button} from "@/components/ui/button";
import {MoonIcon, SunIcon} from "@radix-ui/react-icons";
import {UserNav} from "@/layouts/Header/user-nav";
import {useTheme} from "@/components/theme/theme-provider";


export default function Header() {
    const [themeState, setThemeState] = useState("light");
    const theme = useTheme();

    useEffect(() => {
        // @ts-ignore
        theme.setTheme(themeState)
    }, [themeState])


    return (
        <header className="border-b sticky z-[50] top-0 backdrop-blur-xl">
            <div className="flex h-16 items-center px-4">
                <MainNav/>
                <div className="ml-auto flex items-center space-x-4">
                    <Search className={"hidden xl:block"}/>
                    <Button variant="outline" size="icon" onClick={() => {
                        if (theme.theme === 'dark') setThemeState('light');
                        else setThemeState('dark');
                    }}>
                        <SunIcon
                            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                        <MoonIcon
                            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <UserNav/>
                </div>
            </div>
        </header>
    )
}
