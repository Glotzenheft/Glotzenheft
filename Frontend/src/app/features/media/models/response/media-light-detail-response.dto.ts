import {MediaType} from '../enums/media-type.enum';

export interface MediaLightDetailResponseDto {
    id: number;
    createdAt: string;
    updatedAt: string | null;
    posterPath: string | null;
    type: MediaType;
}
