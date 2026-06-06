import { api } from './client';
import type {
  EventDto,
  ExpenseDto,
  GroupDto,
  InviteDto,
  SettlementDto,
  UserDto,
} from './types';

export const auth = {
  requestOtp: (phone: string) => api<{ request_id: string }>('POST', '/auth/request-otp', { phone }),
  verifyOtp: (phone: string, otp: string, name?: string) =>
    api<{ access_token: string; user: UserDto }>('POST', '/auth/verify-otp', { phone, otp, name }),
};

export const me = {
  read: () => api<UserDto>('GET', '/me'),
  update: (patch: { name?: string; avatar?: string }) => api<UserDto>('PATCH', '/me', patch),
};

export const groups = {
  list: () => api<GroupDto[]>('GET', '/groups'),
  create: (input: { kind: 'roomies' | 'trips'; name: string; icon?: string }) =>
    api<GroupDto>('POST', '/groups', input),
  read: (id: string) => api<GroupDto>('GET', `/groups/${id}`),
  delete: (id: string) => api<void>('DELETE', `/groups/${id}`),
  leave: (id: string) => api<void>('POST', `/groups/${id}/leave`),
};

export const invites = {
  create: (groupId: string, input: { expires_in_hours?: number; max_uses?: number } = {}) =>
    api<InviteDto>('POST', `/groups/${groupId}/invites`, input),
  accept: (code: string) => api<GroupDto>('POST', `/invites/${code}/accept`),
};

export const expenses = {
  list: (groupId: string, since?: string) =>
    api<ExpenseDto[]>('GET', `/groups/${groupId}/expenses`, undefined, { since }),
  create: (groupId: string, input: Partial<ExpenseDto> & { amount: number }) =>
    api<ExpenseDto>('POST', `/groups/${groupId}/expenses`, input),
  update: (groupId: string, id: string, input: Partial<ExpenseDto>) =>
    api<ExpenseDto>('PATCH', `/groups/${groupId}/expenses/${id}`, input),
  delete: (groupId: string, id: string) =>
    api<void>('DELETE', `/groups/${groupId}/expenses/${id}`),
};

export const settlements = {
  list: (groupId: string, since?: string) =>
    api<SettlementDto[]>('GET', `/groups/${groupId}/settlements`, undefined, { since }),
  create: (
    groupId: string,
    input: { from_id: string; to_id: string; amount: number; paid_at: string; note?: string },
  ) => api<SettlementDto>('POST', `/groups/${groupId}/settlements`, input),
  delete: (groupId: string, id: string) =>
    api<void>('DELETE', `/groups/${groupId}/settlements/${id}`),
};

export const events = {
  list: (groupId: string, query: { month?: string; since?: string; limit?: number } = {}) =>
    api<EventDto[]>('GET', `/groups/${groupId}/events`, undefined, query),
  comment: (groupId: string, subjectId: string, body: string) =>
    api<EventDto>('POST', `/groups/${groupId}/events`, {
      kind: 'comment',
      subject_id: subjectId,
      payload: { body },
    }),
};
