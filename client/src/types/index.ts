export interface LovePageData {
    slug?: string;
    partnerName: string;
    yourName: string;
    relationshipDate: string;
    themeColor: string;
    password?: string;
    bgMusicUrl?: string;
    loveLetter: string;
    photos: { url: string }[];
    reasons: { text: string }[];
    isPrivate: boolean;
}

export const defaultPageData: LovePageData = {
    partnerName: '',
    yourName: '',
    relationshipDate: '',
    themeColor: '#D32F2F',
    loveLetter: '',
    photos: [],
    reasons: [],
    isPrivate: false
};
