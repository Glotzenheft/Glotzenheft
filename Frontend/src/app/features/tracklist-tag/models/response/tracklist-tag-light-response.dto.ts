import { TracklistTagType } from '../tracklist-tag-type.enum';

export interface TracklistTagLightResponseDto {
    id: number;
    tagName: string;
    tracklistTagType: TracklistTagType;
    color: string | null;
    description: string | null;
    icon: string | null;
    slug: string;
    isSpoiler: boolean;
    isAdult: boolean;
    createdAt: string;
    updatedAt: string | null;
}
