interface UserMenuItem {
  label: string;
  icon: string;
  command: () => void;
}

export interface UserMenuList {
  label: string;
  items: UserMenuItem[];
}

export interface DeleteUserRequest {
  security_question: string;
  security_answer: string;
}

export interface UserActivity {
  date: string;
  episodeID: number | null;
  episodeNumber: number | null;
  mediaID: number;
  mediaTitle: string;
  posterPath: string | null;
  seasonID: number | null;
  seasonNumber: number | null;
  stillPath: string | null; // if episode
  tracklistEpisodeID: number | null;
  tracklistID: number;
  tracklistName: string;
  tracklistSeasinID: number | null;
  type: string;
}

export interface UserActivitiesPageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
