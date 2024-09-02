import ThemeRoutes from "@/routes";
import {BrowserRouter} from "react-router-dom";
import {ThemeProvider} from "@/components/theme/theme-provider";
import ErrorBoundary from "@/layouts/ErrorBoundary";
import WindowSizeDetectorLayout from "@/layouts/WindowSizeDetectorLayout";


function App() {
    return (
        <ThemeProvider defaultTheme={"light"} key={"sla-proj"} storageKey={"sla-proj"}>
            <BrowserRouter basename="/">
                <ErrorBoundary>
                    <WindowSizeDetectorLayout>
                        <ThemeRoutes/>
                    </WindowSizeDetectorLayout>
                </ErrorBoundary>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
