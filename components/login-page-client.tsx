"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { setCurrentAccount, validateLogin } from "@/lib/auth";
import { demoAccounts } from "@/lib/data";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "owner" ? "owner" : "student";
  const initialEmail = searchParams.get("email") ?? "";
  const [role, setRole] = useState<"student" | "owner">(initialRole);
  const [email, setEmail] = useState(initialEmail || demoAccounts[initialRole].email);
  const [password, setPassword] = useState(demoAccounts[initialRole].password);
  const [message, setMessage] = useState("");
  const activeAccount = demoAccounts[role];

  const handleRoleChange = (nextRole: "student" | "owner") => {
    setRole(nextRole);
    setEmail(demoAccounts[nextRole].email);
    setPassword(demoAccounts[nextRole].password);
    setMessage("");
  };

  const handleLogin = () => {
    const result = validateLogin(role, email, password);
    if (!result.ok || !result.account) {
      setMessage(result.message);
      return;
    }

    setMessage(result.message);
    setCurrentAccount(result.account);
    router.push(role === "student" ? "/student" : "/owner");
  };

  return (
    <main className="login-shell">
      <section className="panel">
        <div className="eyebrow">Role-Based Access</div>
        <h1>Separate login for students and laundry owners.</h1>
        <p>
          This starter ships with demo credentials for both account types so you can immediately test the two
          flows and later connect real authentication.
        </p>
        <div className="pill-row">
          <button className={role === "student" ? "primary" : "secondary"} onClick={() => handleRoleChange("student")}>
            Student Login
          </button>
          <button className={role === "owner" ? "primary" : "secondary"} onClick={() => handleRoleChange("owner")}>
            Owner Login
          </button>
        </div>
      </section>

      <section className="card login-card">
        <h3>{role === "student" ? "Student Account" : "Laundry Owner Account"}</h3>
        <div className="form-grid">
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="primary" onClick={handleLogin} type="button">
            Continue to {role === "student" ? "Student Dashboard" : "Owner Console"}
          </button>
          <p className="mini-note">Demo credentials: {activeAccount.email} / {activeAccount.password}</p>
          <p className="mini-note">{message || "New here? Create a separate student or owner account first."}</p>
          <p className="mini-note">
            Need an account? <Link href="/auth/signup">Go to signup</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
