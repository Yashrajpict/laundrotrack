"use client";

import { demoAccounts } from "@/lib/data";
import { UserRole } from "@/lib/types";

type StudentAccount = {
  role: "student";
  name: string;
  email: string;
  password: string;
  hostel: string;
};

type OwnerAccount = {
  role: "owner";
  name: string;
  email: string;
  password: string;
  laundryName: string;
  address: string;
};

export type StoredAccount = StudentAccount | OwnerAccount;

const storageKey = "laundrotrack.accounts";

function getDemoAccounts(): StoredAccount[] {
  return [
    {
      role: "student",
      name: demoAccounts.student.name,
      email: demoAccounts.student.email,
      password: demoAccounts.student.password,
      hostel: demoAccounts.student.hostel
    },
    {
      role: "owner",
      name: demoAccounts.owner.name,
      email: demoAccounts.owner.email,
      password: demoAccounts.owner.password,
      laundryName: "FreshLoop Laundry",
      address: "Hostel Square, Sector 14, Chandigarh"
    }
  ];
}

export function getAccounts() {
  if (typeof window === "undefined") {
    return getDemoAccounts();
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return getDemoAccounts();
  }

  try {
    const stored = JSON.parse(raw) as StoredAccount[];
    return [...getDemoAccounts(), ...stored];
  } catch {
    return getDemoAccounts();
  }
}

export function saveAccount(account: StoredAccount) {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage unavailable." };
  }

  const existingStored = window.localStorage.getItem(storageKey);
  const parsedStored = existingStored ? ((JSON.parse(existingStored) as StoredAccount[]) ?? []) : [];
  const allAccounts = [...getDemoAccounts(), ...parsedStored];
  const duplicate = allAccounts.find(
    (entry) => entry.email.toLowerCase() === account.email.toLowerCase() && entry.role === account.role
  );

  if (duplicate) {
    return { ok: false, message: "An account with this email already exists for that role." };
  }

  parsedStored.push(account);
  window.localStorage.setItem(storageKey, JSON.stringify(parsedStored));
  return { ok: true, message: "Signup successful." };
}

export function validateLogin(role: UserRole, email: string, password: string) {
  const account = getAccounts().find(
    (entry) =>
      entry.role === role &&
      entry.email.toLowerCase() === email.toLowerCase() &&
      entry.password === password
  );

  if (!account) {
    return { ok: false, message: "Invalid email or password for this role." };
  }

  return { ok: true, message: "Login successful.", account };
}
