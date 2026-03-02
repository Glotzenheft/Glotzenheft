export interface TracklistTags {
    id: number;
    tagName: string;
    tracklistTagType: string;
    color: string | null;
    description: string | null;
    icon: string | null;
    slug: string;
    isSpoiler: boolean;
    createdAt: string;
    updatedAt: string | null;
}
