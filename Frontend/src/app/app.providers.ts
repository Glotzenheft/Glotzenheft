import { Provider } from "@angular/core";
import { IT_AUTH_REPOSITORY } from "./core/interfaces/auth.repository"
import { R_Auth } from "./infrastructure/non-api/auth-service.repository";
import { IT_EPISODE_REPOSITORY } from "./core/interfaces/episode.repository";
import { R_EpisodeHttp } from "./infrastructure/api/episode-http.repository";
import { IT_MEDIA_REPOSITORY } from "./core/interfaces/media.repository";
import { R_MediaHttp } from "./infrastructure/api/media-http.repository";
import { IT_NAVIGATION_REPOSITORY } from "./core/interfaces/navigation.repository";
import { R_Navigation } from "./infrastructure/non-api/navigation-service.repository";
import { IT_SEARCH_REPOSITORY } from "./core/interfaces/search.repository";
import { R_Search } from "./infrastructure/non-api/search-service.repository";
import { IT_SECURITY_REPOSITORY } from "./core/interfaces/security.repository";
import { R_Security } from "./infrastructure/non-api/security-service.repository";
import { IT_STRING_REPOSITORY } from "./core/interfaces/string.repository";
import { R_String } from "./infrastructure/non-api/string-service.repository";
import { IT_TRACKLIST_REPOSITORY } from "./core/interfaces/tracklist.repository";
import { R_TracklistHttp } from "./infrastructure/api/tracklist-service.repository";
import { IT_USER_REPOSITORY } from "./core/interfaces/user.repository";
import { R_UserHTTP } from "./infrastructure/api/user-http.repository";

export const provideAppConfig = (): Provider[] => {
    return [
        { provide: IT_AUTH_REPOSITORY, useClass: R_Auth },
        { provide: IT_EPISODE_REPOSITORY, useClass: R_EpisodeHttp },
        { provide: IT_MEDIA_REPOSITORY, useClass: R_MediaHttp },
        { provide: IT_NAVIGATION_REPOSITORY, useClass: R_Navigation },
        { provide: IT_SEARCH_REPOSITORY, useClass: R_Search },
        { provide: IT_SECURITY_REPOSITORY, useClass: R_Security },
        { provide: IT_STRING_REPOSITORY, useClass: R_String },
        { provide: IT_TRACKLIST_REPOSITORY, useClass: R_TracklistHttp },
        { provide: IT_USER_REPOSITORY, useClass: R_UserHTTP }
    ]
}