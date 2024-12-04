import axios from "axios";
import type { User, ServiceAccount, Subscription, Device, ActivityLog } from "./types";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

// Users
export async function getUsers() {
  const { data } = await api.get<User[]>("/users");
  return data;
}

export async function createUser(user: Partial<User>) {
  const { data } = await api.post<User>("/users", user);
  return data;
}

// Service Accounts
export async function getServiceAccounts() {
  const { data } = await api.get<ServiceAccount[]>("/service-accounts");
  return data;
}

export async function createServiceAccount(account: Partial<ServiceAccount>) {
  const { data } = await api.post<ServiceAccount>("/service-accounts", account);
  return data;
}

// Subscriptions
export async function getSubscriptions() {
  const { data } = await api.get<Subscription[]>("/subscriptions");
  return data;
}

export async function createSubscription(subscription: Partial<Subscription>) {
  const { data } = await api.post<Subscription>("/subscriptions", subscription);
  return data;
}

// Devices
export async function getDevices() {
  const { data } = await api.get<Device[]>("/devices");
  return data;
}

export async function createDevice(device: Partial<Device>) {
  const { data } = await api.post<Device>("/devices", device);
  return data;
}

// Activity Logs
export async function getActivityLogs() {
  const { data } = await api.get<ActivityLog[]>("/activity-logs");
  return data;
}

// Dashboard Stats
export async function fetchDashboardStats() {
  const { data } = await api.get("/stats");
  return data;
}