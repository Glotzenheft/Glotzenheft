export interface I_SecurityRepository {
    validateMediaURL: (mediaURL: string) => boolean,
    isValidUserName: (userName: string) => boolean
}