import ThemeRoutes from "@/routes";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@/components/theme/theme-provider";


function App() {
    return (
        <ThemeProvider defaultTheme={"light"} key={"sla-proj"} storageKey={"sla-proj"}>
            <BrowserRouter basename="/">
                <ThemeRoutes/>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
