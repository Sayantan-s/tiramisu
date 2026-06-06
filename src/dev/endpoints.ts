import { api } from '../lib/api';
import type { UserDto } from '../lib/api';

export type SeedRoommateOut = {
  user: UserDto;
  access_token: string;
};

export const devEndpoints = {
  seedRoommate: (input: { group_id: string; name: string; avatar?: string }) =>
    api<SeedRoommateOut>('POST', '/dev/seed-roommate', input),
};
