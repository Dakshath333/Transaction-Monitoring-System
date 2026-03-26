/**
 * TxnWatch – Real-Time Transaction Monitoring System
 * Full React Application (Single File, No External CSS)
 * Tech: React.js (hooks), Recharts, Inline Styles
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & DATA SEEDS
// ─────────────────────────────────────────────────────────────────────────────

const SENDERS = [
  "Arjun Mehta", "Priya Sharma", "Rahul Gupta", "Sneha Iyer", "Vikram Nair",
  "Deepa Rao", "Karthik Pillai", "Anjali Singh", "Rohan Desai", "Meena Patel",
  "Suresh Kumar", "Lakshmi Verma", "Nitesh Joshi", "Pooja Agarwal", "Amit Tiwari",
];

const RECEIVERS = [
  "HDFC Bank Ltd", "ICICI Corp", "SBI Transfers", "Axis Payments", "Kotak Mahindra",
  "Paytm Wallet", "PhonePe Ltd", "GPay Services", "Razorpay Ltd", "Cashfree Pvt",
  "IndusInd Bank", "Yes Bank Ltd", "Federal Bank", "Punjab National", "Bank of Baroda",
];

const BANKS = [
  "HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank",
  "Kotak Mahindra", "IndusInd Bank", "Yes Bank", "Federal Bank",
];

const TXN_TYPES = ["NEFT", "RTGS", "IMPS", "UPI", "SWIFT", "NACH"];

const CATEGORIES = [
  "Salary", "Business", "Retail", "Investment", "Insurance",
  "Utilities", "E-Commerce", "Real Estate", "Loan Repayment", "International",
];

const RISK_COLORS = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#22c55e" };
const STATUS_COLORS = { SUCCESS: "#22c55e", PENDING: "#f59e0b", FAILED: "#ef4444" };
const CHART_COLORS = ["#6366f1", "#f59e0b", "#22c55e", "#ef4444", "#8b5cf6", "#0ea5e9"];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const genTxnId = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `TXN-${date}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

const classifyRisk = (amount) => {
  const r = Math.random();
  if (amount > 800000 || r < 0.04) return "HIGH";
  if (r < 0.19) return "MEDIUM";
  return "LOW";
};

const assignStatus = () => {
  const r = Math.random();
  if (r < 0.88) return "SUCCESS";
  if (r < 0.94) return "PENDING";
  return "FAILED";
};

const generateTransaction = () => {
  const amount = randInt(500, 1500000);
  return {
    id: genTxnId(),
    sender: pick(SENDERS),
    receiver: pick(RECEIVERS),
    bank: pick(BANKS),
    amount,
    type: pick(TXN_TYPES),
    category: pick(CATEGORIES),
    status: assignStatus(),
    risk: classifyRisk(amount),
    timestamp: new Date().toISOString(),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const Badge = ({ label, color, bg }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 999,
    fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
    color: color || "#fff", background: bg || "#6366f1",
  }}>{label}</span>
);

const RiskBadge = ({ level }) => {
  const map = { HIGH: { bg: "#fef2f2", color: "#ef4444" }, MEDIUM: { bg: "#fffbeb", color: "#d97706" }, LOW: { bg: "#f0fdf4", color: "#16a34a" } };
  return <Badge label={level} {...(map[level] || map.LOW)} />;
};

const StatusBadge = ({ status }) => {
  const map = { SUCCESS: { bg: "#f0fdf4", color: "#16a34a" }, PENDING: { bg: "#fffbeb", color: "#d97706" }, FAILED: { bg: "#fef2f2", color: "#ef4444" } };
  return <Badge label={status} {...(map[status] || map.SUCCESS)} />;
};

const StatCard = ({ icon, title, value, sub, accent }) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: "20px 24px", flex: 1, minWidth: 160,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderTop: `4px solid ${accent}`,
    display: "flex", flexDirection: "column", gap: 6,
  }}>
    <div style={{ fontSize: 22 }}>{icon}</div>
    <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{title}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#94a3b8" }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ title, right }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{title}</h2>
    {right}
  </div>
);

const AlertCard = ({ txn, onClick }) => (
  <div onClick={() => onClick(txn)} style={{
    background: "#fef2f2", border: "1px solid #fecaca", borderLeft: "4px solid #ef4444",
    borderRadius: 10, padding: "12px 14px", cursor: "pointer", marginBottom: 10,
    transition: "box-shadow 0.15s",
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.15)"}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
  >
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#ef4444" }}>⚠ HIGH RISK</span>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(txn.timestamp).toLocaleTimeString()}</span>
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{txn.sender}</div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
      <span style={{ fontSize: 12, color: "#64748b" }}>{txn.id}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>{formatINR(txn.amount)}</span>
    </div>
  </div>
);

const DetailModal = ({ txn, onClose }) => {
  if (!txn) return null;
  const rows = [
    ["Transaction ID", txn.id], ["Sender", txn.sender], ["Receiver", txn.receiver],
    ["Bank", txn.bank], ["Amount", formatINR(txn.amount)], ["Type", txn.type],
    ["Category", txn.category], ["Timestamp", new Date(txn.timestamp).toLocaleString()],
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Transaction Details</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 20, color: "#94a3b8" }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <RiskBadge level={txn.risk} /><StatusBadge status={txn.status} />
        </div>
        {rows.map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function TxnWatch() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");
  const [isLive, setIsLive] = useState(true);
  const [volumeData, setVolumeData] = useState([]);
  const intervalRef = useRef(null);

  const addTransaction = useCallback(() => {
    const txn = generateTransaction();
    setTransactions(prev => [txn, ...prev].slice(0, 200));
    setVolumeData(prev => {
      const tick = {
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        amount: txn.amount,
        count: (prev[prev.length - 1]?.count || 0) + 1,
      };
      return [...prev, tick].slice(-15);
    });
  }, []);

  useEffect(() => {
    const seed = Array.from({ length: 20 }, generateTransaction);
    setTransactions(seed);
    setVolumeData(seed.slice(-15).map((t, i) => ({
      time: new Date(new Date(t.timestamp) - (14 - i) * 1500).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      amount: t.amount, count: i + 1,
    })));
  }, []);

  useEffect(() => {
    if (isLive) { intervalRef.current = setInterval(addTransaction, randInt(1000, 2000)); }
    else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [isLive, addTransaction]);

  const alerts = transactions.filter(t => t.risk === "HIGH").slice(0, 20);
  const filtered = transactions.filter(t => {
    const q = search.toLowerCase();
    return (!q || t.id.toLowerCase().includes(q) || t.sender.toLowerCase().includes(q) || t.receiver.toLowerCase().includes(q))
      && (filterRisk === "ALL" || t.risk === filterRisk)
      && (filterStatus === "ALL" || t.status === filterStatus)
      && (filterType === "ALL" || t.type === filterType);
  });

  const riskDist = ["HIGH", "MEDIUM", "LOW"].map(r => ({ name: r, value: transactions.filter(t => t.risk === r).length }));
  const categoryDist = CATEGORIES.map(cat => ({
    name: cat.substring(0, 8),
    count: transactions.filter(t => t.category === cat).length,
    amount: +(transactions.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0) / 100000).toFixed(1),
  })).sort((a, b) => b.count - a.count).slice(0, 7);
  const typeDist = TXN_TYPES.map(ty => ({ name: ty, count: transactions.filter(t => t.type === ty).length }));
  const trendData = volumeData.map(d => ({ ...d, avg: Math.round(d.amount / 1000), peak: Math.round(d.amount / 800) }));
  const totalAmount = transactions.reduce((s, t) => s + t.amount, 0);
  const successCount = transactions.filter(t => t.status === "SUCCESS").length;
  const highRiskCount = transactions.filter(t => t.risk === "HIGH").length;

  const S = {
    app: { fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh", color: "#0f172a" },
    navbar: { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 },
    logo: { display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" },
    logoIcon: { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 900 },
    navBtn: (a) => ({ padding: "6px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit", background: a ? "#6366f1" : "transparent", color: a ? "#fff" : "#64748b", transition: "all 0.15s" }),
    liveBtn: (live) => ({ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: `1px solid ${live ? "#bbf7d0" : "#e2e8f0"}`, background: live ? "#f0fdf4" : "#f8fafc", color: live ? "#16a34a" : "#94a3b8", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }),
    pulse: (live) => ({ width: 8, height: 8, borderRadius: "50%", background: live ? "#22c55e" : "#cbd5e1", animation: live ? "pulse 1.5s infinite" : "none" }),
    body: { padding: "24px 32px", maxWidth: 1600, margin: "0 auto" },
    statsRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 },
    grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
    card: { background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
    filterRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 },
    input: { border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#0f172a", fontFamily: "inherit", outline: "none", background: "#f8fafc" },
    select: { border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#0f172a", fontFamily: "inherit", cursor: "pointer", background: "#f8fafc" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 12px", borderBottom: "2px solid #f1f5f9" },
    td: (h) => ({ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #f8fafc", background: h ? "#fffbeb" : "transparent" }),
    chartsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
    alertBadge: { background: "#ef4444", color: "#fff", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "2px 7px", marginLeft: 6 },
  };

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        tr:hover td { background: #f8fafc !important; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      <nav style={S.navbar}>
        <div style={S.logo}>
          <div style={S.logoIcon}>T</div>
          TxnWatch
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>v1.0</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={S.navBtn(activeTab === "feed")} onClick={() => setActiveTab("feed")}>Live Feed</button>
          <button style={S.navBtn(activeTab === "analytics")} onClick={() => setActiveTab("analytics")}>Analytics</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{transactions.length} txns monitored</span>
          <button style={S.liveBtn(isLive)} onClick={() => setIsLive(l => !l)}>
            <div style={S.pulse(isLive)} />{isLive ? "LIVE" : "PAUSED"}
          </button>
        </div>
      </nav>

      <div style={S.body}>
        <div style={S.statsRow}>
          <StatCard icon="💸" title="Total Volume" value={formatINR(totalAmount)} sub={`${transactions.length} transactions`} accent="#6366f1" />
          <StatCard icon="✅" title="Success Rate" value={`${transactions.length ? Math.round((successCount / transactions.length) * 100) : 0}%`} sub={`${successCount} successful`} accent="#22c55e" />
          <StatCard icon="🚨" title="High Risk" value={highRiskCount} sub="Flagged transactions" accent="#ef4444" />
          <StatCard icon="⏱" title="Avg Amount" value={transactions.length ? formatINR(Math.round(totalAmount / transactions.length)) : "—"} sub="per transaction" accent="#f59e0b" />
          <StatCard icon="🏦" title="Monitor Start" value={new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} sub="Session active" accent="#0ea5e9" />
        </div>

        {activeTab === "feed" && (
          <div style={S.grid}>
            <div>
              <div style={S.card}>
                <SectionHeader title="Live Transaction Feed" right={<span style={{ fontSize: 12, color: "#94a3b8" }}>Showing {filtered.length} / {transactions.length}</span>} />
                <div style={S.filterRow}>
                  <input style={{ ...S.input, flex: 1, minWidth: 220 }} placeholder="🔍  Search ID, Sender, Receiver…" value={search} onChange={e => setSearch(e.target.value)} />
                  <select style={S.select} value={filterRisk} onChange={e => setFilterRisk(e.target.value)}>
                    <option value="ALL">All Risk</option>
                    <option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
                  </select>
                  <select style={S.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="ALL">All Status</option>
                    <option value="SUCCESS">Success</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option>
                  </select>
                  <select style={S.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
                    <option value="ALL">All Types</option>
                    {TXN_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                  {(search || filterRisk !== "ALL" || filterStatus !== "ALL" || filterType !== "ALL") && (
                    <button onClick={() => { setSearch(""); setFilterRisk("ALL"); setFilterStatus("ALL"); setFilterType("ALL"); }} style={{ ...S.input, cursor: "pointer", color: "#6366f1" }}>Clear ✕</button>
                  )}
                </div>
                <div style={{ overflowX: "auto", maxHeight: 520, overflowY: "auto" }}>
                  <table style={S.table}>
                    <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                      <tr>{["Txn ID", "Sender", "Receiver", "Bank", "Amount", "Type", "Category", "Risk", "Status", "Time"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0, 100).map(txn => (
                        <tr key={txn.id} style={{ cursor: "pointer" }} onClick={() => setSelectedTxn(txn)}>
                          <td style={S.td(txn.risk === "HIGH")}><span style={{ fontFamily: "monospace", fontSize: 12, color: "#6366f1" }}>{txn.id}</span></td>
                          <td style={S.td(txn.risk === "HIGH")}><span style={{ fontWeight: 600 }}>{txn.sender}</span></td>
                          <td style={S.td(txn.risk === "HIGH")}>{txn.receiver}</td>
                          <td style={S.td(txn.risk === "HIGH")}><span style={{ fontSize: 12, color: "#64748b" }}>{txn.bank}</span></td>
                          <td style={S.td(txn.risk === "HIGH")}><span style={{ fontWeight: 700, color: txn.amount > 800000 ? "#ef4444" : "#0f172a" }}>{formatINR(txn.amount)}</span></td>
                          <td style={S.td(txn.risk === "HIGH")}><span style={{ fontSize: 11, background: "#f1f5f9", padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>{txn.type}</span></td>
                          <td style={S.td(txn.risk === "HIGH")}><span style={{ fontSize: 12 }}>{txn.category}</span></td>
                          <td style={S.td(txn.risk === "HIGH")}><RiskBadge level={txn.risk} /></td>
                          <td style={S.td(txn.risk === "HIGH")}><StatusBadge status={txn.status} /></td>
                          <td style={S.td(txn.risk === "HIGH")}><span style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(txn.timestamp).toLocaleTimeString("en-IN")}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <div style={{ ...S.card, position: "sticky", top: 76 }}>
                <SectionHeader title={<>⚠ Alerts Panel <span style={S.alertBadge}>{alerts.length}</span></>} right={<span style={{ fontSize: 12, color: "#94a3b8" }}>HIGH risk only</span>} />
                <div style={{ maxHeight: 580, overflowY: "auto" }}>
                  {alerts.length === 0
                    ? <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>No high-risk alerts</div>
                    : alerts.map(txn => <AlertCard key={txn.id} txn={txn} onClick={setSelectedTxn} />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <div style={S.chartsGrid}>
              <div style={S.card}>
                <SectionHeader title="Transaction Volume (Live)" />
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={volumeData}>
                    <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} /><YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={v => formatINR(v)} /><Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} fill="url(#vg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div style={S.card}>
                <SectionHeader title="Trend Analysis" />
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="time" tick={{ fontSize: 10 }} interval={2} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="avg" name="Avg (₹K)" stroke="#6366f1" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="peak" name="Peak (₹K)" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={S.card}>
                <SectionHeader title="Volume by Category" />
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={categoryDist} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v, n) => n === "amount" ? `₹${v}L` : v} /><Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="count" name="Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="amount" name="Amt (L)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={S.card}>
                <SectionHeader title="Risk & Type Distribution" />
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b", textAlign: "center" }}>Risk Split</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart><Pie data={riskDist} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                        {riskDist.map(e => <Cell key={e.name} fill={RISK_COLORS[e.name]} />)}
                      </Pie><Tooltip /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} /></PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b", textAlign: "center" }}>Txn Types</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart><Pie data={typeDist} dataKey="count" cx="50%" cy="50%" outerRadius={65} paddingAngle={2}>
                        {typeDist.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie><Tooltip /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} /></PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...S.card, marginTop: 20 }}>
              <SectionHeader title="Risk, Status & Type Summary" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {[
                  { title: "Risk Breakdown", items: ["HIGH", "MEDIUM", "LOW"], getBadge: r => <RiskBadge level={r} />, getCount: r => transactions.filter(t => t.risk === r).length, getColor: r => RISK_COLORS[r] },
                  { title: "Status Breakdown", items: ["SUCCESS", "PENDING", "FAILED"], getBadge: s => <StatusBadge status={s} />, getCount: s => transactions.filter(t => t.status === s).length, getColor: s => STATUS_COLORS[s] },
                  { title: "Type Distribution", items: TXN_TYPES, getBadge: (ty, i) => <span style={{ fontSize: 12, fontWeight: 700, color: CHART_COLORS[i % CHART_COLORS.length] }}>{ty}</span>, getCount: ty => transactions.filter(t => t.type === ty).length, getColor: (_, i) => CHART_COLORS[i % CHART_COLORS.length] },
                ].map(({ title, items, getBadge, getCount, getColor }) => (
                  <div key={title}>
                    <h4 style={{ margin: "0 0 12px", fontSize: 13, color: "#64748b" }}>{title}</h4>
                    {items.map((item, i) => {
                      const cnt = getCount(item); const pct = transactions.length ? ((cnt / transactions.length) * 100).toFixed(1) : 0;
                      return (
                        <div key={item} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            {getBadge(item, i)}<span style={{ fontSize: 12, fontWeight: 600 }}>{cnt} ({pct}%)</span>
                          </div>
                          <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99 }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: getColor(item, i), borderRadius: 99, transition: "width 0.5s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <DetailModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
    </div>
  );
}
