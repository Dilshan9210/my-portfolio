import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

// In-memory global store to hold projects during dev/testing until a real DB is connected
let projectsStore = [
  {
    id: "1",
    title: "JAT AI Video Winner",
    subtitle: "AI Video Production",
    description: "Award-winning short film generated entirely through cutting-edge neural rendering, utilizing advanced temporal coherence algorithms for cinematic consistency.",
    skills: ["AI Generation", "Runway Gen-2", "Midjourney", "ComfyUI"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-nebula-in-outer-space-vertical-9028-large.mp4",
    originalVideoLink: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "JADE Restaurant Ad",
    subtitle: "Commercial Spot",
    description: "High-energy commercial advertisement for JADE Restaurant. Seamless transitions, premium motion graphics, and color grading designed to maximize viewer retention.",
    skills: ["Premiere Pro", "After Effects", "Color Grading", "Sound Design"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-coffee-into-a-cup-vertical-43033-large.mp4",
    originalVideoLink: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Seya Ruu Social Promo",
    subtitle: "Social Media Campaign",
    description: "A fast-paced social media promotional sequence crafted to stand out in feeds, incorporating kinetic typography, custom sound design, and animated frame layouts.",
    skills: ["Social Media", "Motion Graphics", "CapCut", "Kinetic Type"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-playing-a-video-game-vertical-41680-large.mp4",
    originalVideoLink: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop"
  }
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, data: projectsStore }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, description, skills, videoLink, embedUrl, thumbnailUrl } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    const newProject = {
      id: Date.now().toString(),
      title,
      subtitle: "New Project",
      description,
      skills: skills || [],
      // Fallback video if embedUrl is null (not a valid YT/Drive link)
      videoUrl: embedUrl || videoLink || "https://assets.mixkit.co/videos/preview/mixkit-nebula-in-outer-space-vertical-9028-large.mp4",
      originalVideoLink: videoLink,
      thumbnailUrl: thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    };

    // Prepend to our in-memory store
    projectsStore = [newProject, ...projectsStore];

    // Purge the stale cache for the portfolio display path
    revalidatePath('/');

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, skills, videoLink, embedUrl, thumbnailUrl } = body;

    if (!id || !title || !description) {
      return NextResponse.json(
        { success: false, error: "ID, Title, and description are required" },
        { status: 400 }
      );
    }

    const index = projectsStore.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Update fields
    projectsStore[index] = {
      ...projectsStore[index],
      title,
      description,
      skills: skills || [],
      videoUrl: embedUrl || videoLink || projectsStore[index].videoUrl,
      originalVideoLink: videoLink,
      thumbnailUrl: thumbnailUrl || projectsStore[index].thumbnailUrl,
    };

    revalidatePath('/');

    return NextResponse.json({ success: true, data: projectsStore[index] }, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const index = projectsStore.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    projectsStore.splice(index, 1);
    revalidatePath('/');

    return NextResponse.json({ success: true, data: { id } }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
