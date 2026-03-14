import { Suspense } from "react";
import ServicesView from "@/src/features/services/components/services-view";

export default function Home() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ServicesView />
        </Suspense>
    );
}