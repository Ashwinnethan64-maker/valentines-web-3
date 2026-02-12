export interface LovePageData {
    id?: string;
    slug?: string;
    yourName: string;
    partnerName: string;
    loveLetter: string;
    photos: { url: string; caption?: string }[];
    reasons: { text: string }[];
    relationshipDate?: string;
    themeColor: string;
    bgMusicUrl: string;
    isPrivate: boolean;
    password?: string;
}

export const defaultPageData: LovePageData = {
    yourName: 'Your Name',
    partnerName: 'Partner Name',
    themeColor: '#FF69B4',
    loveLetter: 'This is a default love letter. No content loaded yet.',
    photos: [],
    reasons: [],
    bgMusicUrl: '',
    isPrivate: false,
    password: '',
};
