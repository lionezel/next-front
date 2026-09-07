import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/src/lib/firebase";
import { projectsData } from "@/src/features/proyect/services/proyect-data";
import { Project } from "@/src/features/proyect/types/project.type";

const COLLECTION_NAME = "proyectos";

/**
 * Obtener listado de proyectos activos
 */
export async function getProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured() || !db) {
    return projectsData;
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("active", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return projectsData;
    }

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Project, "id">),
    }));
    return data.sort((a, b) => ((a as any).order ?? 0) - ((b as any).order ?? 0));
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return projectsData;
  }
}

/**
 * Suscribirse en tiempo real a los proyectos
 */
export function subscribeProjects(
  onUpdate: (projects: Project[]) => void
): Unsubscribe | (() => void) {
  if (!isFirebaseConfigured() || !db) {
    onUpdate(projectsData);
    return () => {};
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("active", "==", true)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(projectsData);
        } else {
          const data = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Project, "id">),
          }));
          data.sort((a, b) => ((a as any).order ?? 0) - ((b as any).order ?? 0));
          onUpdate(data);
        }
      },
      (error) => {
        console.error("Error subscribing to projects:", error);
        onUpdate(projectsData);
      }
    );
  } catch (error) {
    console.error("Error setting up projects subscription:", error);
    onUpdate(projectsData);
    return () => {};
  }
}

/**
 * Guardar o actualizar proyecto (para distripako-admin)
 */
export async function saveProject(project: Partial<Project> & { id?: string }): Promise<string> {
  if (!db) throw new Error("Firestore no está inicializado");

  const projectId = project.id || doc(collection(db, COLLECTION_NAME)).id;
  const docRef = doc(db, COLLECTION_NAME, projectId);

  await setDoc(
    docRef,
    {
      ...project,
      id: projectId,
      active: true,
      updatedAt: serverTimestamp(),
      ...(project.id ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return projectId;
}

/**
 * Eliminar proyecto
 */
export async function deleteProject(projectId: string): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");
  await deleteDoc(doc(db, COLLECTION_NAME, projectId));
}
