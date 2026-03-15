import ServicesView from "@/src/features/services/components/services-view";
import { Suspense } from "react";


export default function services() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ServicesView />
        </Suspense>
    );
}