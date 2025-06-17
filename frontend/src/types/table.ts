
export type Table = {
    id: string;
    name: string;
    qrCode?: string;
    isOccupied: boolean;
    currentOccupancy?: number;
};