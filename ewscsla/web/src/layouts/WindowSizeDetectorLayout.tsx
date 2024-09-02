import {ReactNode} from "react";
import useWindowSize from "@/hooks/useWindowSize";

interface Props {
    children?: ReactNode;
}

export default function WindowSizeDetectorLayout(props: Props) {
    const {isMobile} = useWindowSize();
    if (isMobile) {
        return (
            <div className="h-screen w-sreen flex items-center justify-center">
                <p className="text-base leading-7 text-gray-600 text-muted-foreground">
                    Sorry, page not available on small devices. Use a desktop or a tablet.
                </p>
            </div>
        )
    }

    return props.children;
}