import React, {Component, ErrorInfo, ReactNode} from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-sreen flex items-center justify-center">
                    <p className="text-base leading-7 text-gray-600 text-muted-foreground">
                        Sorry.. there was an error.
                    </p>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
