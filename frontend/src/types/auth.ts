export type FormData = {
  email: string;
  password: string;
  confirmPassword: string | null;
  username: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
};

