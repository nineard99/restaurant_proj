export type RestaurantRoleType = "OWNER" | "MANAGER" | "EMPLOYEE";
export type GlobalRole = "CUSTOMER" | "DEV" | "SUPERADMIN";

export type RestaurantRoleLink = {
  restaurantId: string;
  role: RestaurantRoleType;
  restaurantName: string;
};


export type UserProfile = {
  id: string;
  username: string;
  email: string | null;
  role: GlobalRole;
  restaurantRole: RestaurantRoleLink[];
};