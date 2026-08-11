"use client";
import { useState } from "react";
import { Layers, Lock, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Contraseña incorrecta");
        setSubmitting(false);
        return;
      }
      // Hard navigation so the proxy re-checks the fresh session cookie.
      window.location.href = "/";
    } catch (err) {
      setError("No se pudo conectar. Intenta de nuevo.");
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <style>{CSS}</style>
      <form className="login__card" onSubmit={onSubmit}>
        <div className="login__mark"><Layers size={20} /></div>
        <div className="login__title">Project Plan Finder</div>
        <div className="login__sub">Enter password to continue</div>

        <label className="login__field">
          <Lock size={15} />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>

        {error && (
          <div className="login__error"><AlertTriangle size={14} /> {error}</div>
        )}

        <button type="submit" className="login__btn" disabled={submitting || !password}>
          {submitting ? "Verificando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;450;500;600&display=swap');

:root{
  --paper:#EBEDEA; --surface:#FBFBF9; --surface2:#F4F5F2;
  --ink:#1A1E20; --ink2:#454B4E; --muted:#7A8084;
  --line:#D8DBD6; --line2:#E6E8E3;
  --accent:#1E3B33;
  --bad:#B5512F;
  --font-display:'Fraunces',Georgia,'Times New Roman',serif;
  --font-body:'Inter',system-ui,-apple-system,sans-serif;
}

.login{
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:var(--paper); padding:20px; font-family:var(--font-body);
}
.login__card{
  width:100%; max-width:360px; background:var(--surface); border:1px solid var(--line);
  border-radius:16px; padding:34px 30px; box-shadow:0 24px 60px rgba(0,0,0,.08);
  display:flex; flex-direction:column; align-items:center; text-align:center;
}
.login__mark{
  width:44px; height:44px; border-radius:10px; display:grid; place-items:center;
  background:var(--accent); color:#E6DCC8; margin-bottom:16px;
}
.login__title{font-family:var(--font-display); font-weight:600; font-size:19px; color:var(--ink); letter-spacing:-0.01em}
.login__sub{font-size:13px; color:var(--muted); margin-top:6px; margin-bottom:26px}
.login__field{
  width:100%; display:flex; align-items:center; gap:9px; border:1px solid var(--line);
  background:var(--surface2); border-radius:10px; padding:11px 13px; color:var(--muted);
}
.login__field:focus-within{border-color:var(--accent)}
.login__field input{
  flex:1; border:none; background:transparent; outline:none; font-family:var(--font-body);
  font-size:14px; color:var(--ink);
}
.login__error{
  display:flex; align-items:center; gap:7px; color:var(--bad); font-size:12.5px;
  margin-top:12px; align-self:flex-start;
}
.login__btn{
  width:100%; margin-top:20px; border:1px solid var(--accent); background:var(--accent);
  color:#fff; font-family:var(--font-body); font-size:14px; font-weight:500;
  padding:11px 14px; border-radius:10px; cursor:pointer; transition:opacity .15s;
}
.login__btn:disabled{opacity:.55; cursor:default}
.login__btn:not(:disabled):hover{opacity:.92}
`;
