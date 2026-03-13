import { Suspense } from "react";
import HomeView from "@/src/features/home/components/home-view";

export default function Home() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <HomeView />
        </Suspense>
    );
}