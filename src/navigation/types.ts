import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Phone: undefined;
  Otp: undefined;
};

export type ModeStackParamList = {
  ModeHub: undefined;
  GroupsList: undefined;
  CreateGroup: undefined;
  JoinGroup: { prefill?: string } | undefined;
};

export type GroupStackParamList = {
  Landing: undefined;
  InvitePeople: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Mode: NavigatorScreenParams<ModeStackParamList>;
  Group: NavigatorScreenParams<GroupStackParamList>;
};
