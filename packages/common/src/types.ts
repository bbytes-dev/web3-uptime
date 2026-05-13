export enum WebsiteStatus {
  Good = "Good",
  Bad = "Bad",
}


export interface User {
  id: string;
  email: string;
}

export interface Website {
  id: string;
  url: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  disabled: boolean;
  ticks: UptimeTick[];
}

export interface WebsiteCreatePayload {
  url: string;
}

export interface WebsiteCreateResponse {
  id: string;
  message: string;
}

export interface WebsiteDeleteResponse {
  message: string;
}

export interface Validator {
  id: string;
  publicKey: string;
  ipAddress: string;
  location: string;
  isActive: boolean;
  ticks: UptimeTick[];
  pendingPayouts: number;
}

export interface UptimeTick {
  id: string;
  websiteId: string;
  validatorId: string;
  status: WebsiteStatus;
  latency: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
}

export interface SignupCallbackPayload {
  publicKey: string;
  callbackUrl: string;
  ip: string;
}

export interface ValidatePayload {
  callbackId: string;
  status: WebsiteStatus;
  latency: number;
}

export interface SignupIncomingMessage {
  ip: string;
  publicKey: string;
  signedMessage: string;
  callbackId: string;
}

export interface ValidateIncomingMessage {
  callbackId: string;
  signedMessage: string;
  status: 'Good' | 'Bad';
  latency: number;
  websiteId: string;
  validatorId: string;
}

export interface SignupOutgoingMessage {
  validatorId: string;
  callbackId: string;
}

export interface ValidateOutgoingMessage {
  url: string;
  callbackId: string;
  websiteId: string;
}

export type IncomingMessage = {
  type: 'signup';
  data: SignupIncomingMessage;
} | {
  type: 'validate';
  data: ValidateIncomingMessage;
}

export type OutgoingMessage = {
  type: 'signup';
  data: SignupOutgoingMessage;
} | {
  type: 'validate';
  data: ValidateOutgoingMessage;
}
