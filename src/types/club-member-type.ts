export type TClubMember = {
    id: string; // 8 chars, random string
    first: string;
    last: string;
    email: string;
    password: string;
    cell: string
    rating: number;
    status: boolean;
}

export type TClubMemberUpdate = {
    id: string;
    first?: string;
    last?: string;
    email?: string;
    password?: string;
    cell?: string
    rating?: number;
    status?: boolean;
}