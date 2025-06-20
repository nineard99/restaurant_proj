
export type Table = {
    id: string;
    name: string;
    qrCode?: string;
    sessionId?: string;
    isActive: boolean;
    currentOccupancy?: number;
};