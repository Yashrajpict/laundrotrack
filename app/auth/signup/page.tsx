"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveAccount } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "owner">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hostel, setHostel] = useState("");
  const [laundryName, setLaundryName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = () => {
    const result =
      role === "student"
        ? saveAccount({
            role,
            name,
            email,
            password,
            hostel
          })
        : saveAccount({
            role,
            name,
            email,
            password,
            laundryName,
            address
          });

    setMessage(result.message);

    if (result.ok) {
      router.push(`/auth/login?role=${role}&email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <main className="login-shell">
      <section className="panel">
        <div className="eyebrow">Create Account</div>
        <h1>Separate signup for students and laundry owners.</h1>
        <p>
          New users can register here and then log in with the same role on the login page. Student and owner
          accounts stay separated.
        </p>
        <div className="pill-row">
          <button className={role === "student" ? "primary" : "secondary"} onClick={() => setRole("student")}>
            Student Signup
          </button>
          <button className={role === "owner" ? "primary" : "secondary"} onClick={() => setRole("owner")}>
            Owner Signup
          </button>
        </div>
      </section>

      <section className="card login-card">
        <h3>{role === "student" ? "New Student Account" : "New Laundry Owner Account"}</h3>
        <div className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <label className="field">
            <span>Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </label>
          {role === "student" ? (
            <label className="field">
              <span>Hostel / Residence</span>
              <input value={hostel} onChange={(event) => setHostel(event.target.value)} />
            </label>
          ) : (
            <>
              <label className="field">
                <span>Laundry Name</span>
                <input value={laundryName} onChange={(event) => setLaundryName(event.target.value)} />
              </label>
              <label className="field">
                <span>Laundry Address</span>
                <input value={address} onChange={(event) => setAddress(event.target.value)} />
              </label>
            </>
          )}
          <button className="primary" onClick={handleSignup} type="button">
            Create {role === "student" ? "Student" : "Owner"} Account
          </button>
          <p className="mini-note">{message || "After signup, you will be redirected to the login page."}</p>
          <p className="mini-note">
            Already registered? <Link href="/auth/login">Go to login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
