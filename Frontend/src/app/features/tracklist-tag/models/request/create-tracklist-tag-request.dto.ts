import { TracklistTagType } from "../tracklist-tag-type.enum";

export interface CreateTracklistTagRequestDto {
    tag_name: string;
    tracklist_tag_type: TracklistTagType;
    color?: string | null;
    description?: string | null;
    icon?: string | null;
    tracklist_id?: number | null;
    is_spoiler?: boolean;
    is_adult?: boolean;
}
