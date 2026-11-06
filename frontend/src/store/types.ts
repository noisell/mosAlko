export type NavigationPaths = '/home' | '/categories' | '/basket' | '/profile';

export type NavigationState = {
    active: NavigationPaths;
    show: boolean;
    changeShow: (show: boolean) => void;
    changeActive: (active: NavigationPaths) => void;
}