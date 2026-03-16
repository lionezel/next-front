export interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    logo: string;
    techStack: {
        name: string;
        icon: string;
        category: string;
    }[];
    features: {
        title: string;
        description: string;
    }[];
    overview: {
        vision: string;
        highlight1: string;
        highlight2: string;
    };
    stats: {
        indicator: string;
        title: string;
        description: string;
        statusLabel: string;
    };
    design: {
        description: string;
        palette: string[];
        screenshots: string[];
    };
}
