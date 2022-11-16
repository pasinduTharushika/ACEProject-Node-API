export interface RefreshToken {
  user_id: number;
  id: number;
  refresh_token: string;
  generated_at: Date;
  expiry_at: Date;
  active: boolean;
}
