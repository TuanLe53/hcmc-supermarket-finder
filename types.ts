export interface Coordinate{
    long: number;
    lat: number;
}

export interface LocationMarker{
    id: string;
    name: string;
    address: string;
    location: [number, number];
    type?: "wishlist" | "supermarket";
}

export interface WishlistItem{
    name: string;
    quantity: string;
}

export interface UserDataDecode{
    username: string;
    id: string;
    iat: number;
    exp: number;
}