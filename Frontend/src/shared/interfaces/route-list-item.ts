export interface RoutesListItem {
  description: string;
  fullUrl: string;
  shortUrl: string;
  showInLinkList: boolean; // deciding whether url should be listet in a list of links of this webste, e. g. in the footer list
}

export interface VisibleRoute {
  description: string;
  fullUrl: string;
  shortUrl: string;
}
