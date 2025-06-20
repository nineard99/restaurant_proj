import { MenuItem } from "./menu";

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: string;
}

export interface OrderDetail {
    menuItemId: string;
    quantity: Number;
}