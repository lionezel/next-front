import { Suspense } from "react";
import ProyectView from "@/src/features/proyect/components/proyect-view";

export default async function Proyect({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <ProyectView projectId={id} />
        </Suspense>
    );
}