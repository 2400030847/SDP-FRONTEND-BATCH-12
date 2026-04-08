// Demo users and sample data for demonstration mode
export const DEMO_USERS = [
  {
    email: "admin@demo.com",
    password: "demo123",
    name: "Admin User",
    role: "admin",
    avatar: "👑"
  },
  {
    email: "lender@demo.com",
    password: "demo123",
    name: "Rajesh Kumar",
    role: "lender",
    avatar: "🏦"
  },
  {
    email: "borrower@demo.com",
    password: "demo123",
    name: "Priya Sharma",
    role: "borrower",
    avatar: "👤"
  },
  {
    email: "analyst@demo.com",
    password: "demo123",
    name: "Amit Patel",
    role: "analyst",
    avatar: "📊"
  }
];

export const DEMO_LOANS = [
  {
    id: "LN10001",
    name: "Priya Sharma",
    email: "borrower@demo.com",
    type: "Personal Loan",
    amount: 250000,
    interest: 12.5,
    tenure: 24,
    purpose: "Home renovation and furniture purchase",
    date: "2025-11-15",
    status: "Active",
    emi: 11823,
    paidEmis: 3,
    totalEmis: 24
  },
  {
    id: "LN10002",
    name: "Priya Sharma",
    email: "borrower@demo.com",
    type: "Education Loan",
    amount: 500000,
    interest: 8.5,
    tenure: 60,
    purpose: "Masters degree in Computer Science",
    date: "2025-08-20",
    status: "Active",
    emi: 10247,
    paidEmis: 6,
    totalEmis: 60
  },
  {
    id: "LN10003",
    name: "Vikram Singh",
    email: "vikram@example.com",
    type: "Home Loan",
    amount: 3500000,
    interest: 7.2,
    tenure: 240,
    purpose: "Purchase of 2BHK apartment in Hyderabad",
    date: "2025-06-10",
    status: "Active",
    emi: 27513,
    paidEmis: 8,
    totalEmis: 240
  },
  {
    id: "LN10004",
    name: "Sneha Reddy",
    email: "sneha@example.com",
    type: "Business Loan",
    amount: 1000000,
    interest: 14.0,
    tenure: 36,
    purpose: "Expansion of textile business",
    date: "2025-09-05",
    status: "Approved",
    emi: 34178,
    paidEmis: 0,
    totalEmis: 36
  },
  {
    id: "LN10005",
    name: "Ravi Teja",
    email: "ravi@example.com",
    type: "Vehicle Loan",
    amount: 800000,
    interest: 9.5,
    tenure: 48,
    purpose: "Purchase of Hyundai Creta",
    date: "2026-01-12",
    status: "Active",
    emi: 20086,
    paidEmis: 1,
    totalEmis: 48
  },
  {
    id: "LN10006",
    name: "Anita Verma",
    email: "anita@example.com",
    type: "Personal Loan",
    amount: 150000,
    interest: 13.0,
    tenure: 12,
    purpose: "Medical emergency expenses",
    date: "2025-12-01",
    status: "Active",
    emi: 13388,
    paidEmis: 2,
    totalEmis: 12
  },
  {
    id: "LN10007",
    name: "Karan Malhotra",
    email: "karan@example.com",
    type: "Education Loan",
    amount: 1200000,
    interest: 7.5,
    tenure: 84,
    purpose: "MBA from IIM Ahmedabad",
    date: "2025-07-15",
    status: "Active",
    emi: 18321,
    paidEmis: 7,
    totalEmis: 84
  },
  {
    id: "LN10008",
    name: "Deepa Nair",
    email: "deepa@example.com",
    type: "Home Loan",
    amount: 5000000,
    interest: 6.8,
    tenure: 300,
    purpose: "Purchase of villa in Kochi",
    date: "2025-10-20",
    status: "Pending",
    emi: 35212,
    paidEmis: 0,
    totalEmis: 300
  },
  {
    id: "LN10009",
    name: "Suresh Babu",
    email: "suresh@example.com",
    type: "Business Loan",
    amount: 2000000,
    interest: 15.5,
    tenure: 48,
    purpose: "Restaurant chain expansion",
    date: "2026-02-01",
    status: "Rejected",
    emi: 0,
    paidEmis: 0,
    totalEmis: 0
  },
  {
    id: "LN10010",
    name: "Priya Sharma",
    email: "borrower@demo.com",
    type: "Gold Loan",
    amount: 300000,
    interest: 10.0,
    tenure: 12,
    purpose: "Short-term working capital",
    date: "2026-01-25",
    status: "Pending",
    emi: 26375,
    paidEmis: 0,
    totalEmis: 12
  }
];

export const DEMO_PAYMENTS = [
  { id: "PAY001", loanId: "LN10001", amount: 11823, date: "2025-12-15", status: "Paid", method: "UPI" },
  { id: "PAY002", loanId: "LN10001", amount: 11823, date: "2026-01-15", status: "Paid", method: "Net Banking" },
  { id: "PAY003", loanId: "LN10001", amount: 11823, date: "2026-02-15", status: "Paid", method: "UPI" },
  { id: "PAY004", loanId: "LN10002", amount: 10247, date: "2025-09-20", status: "Paid", method: "Auto Debit" },
  { id: "PAY005", loanId: "LN10002", amount: 10247, date: "2025-10-20", status: "Paid", method: "Auto Debit" },
  { id: "PAY006", loanId: "LN10002", amount: 10247, date: "2025-11-20", status: "Paid", method: "Auto Debit" },
  { id: "PAY007", loanId: "LN10002", amount: 10247, date: "2025-12-20", status: "Paid", method: "Auto Debit" },
  { id: "PAY008", loanId: "LN10002", amount: 10247, date: "2026-01-20", status: "Paid", method: "Auto Debit" },
  { id: "PAY009", loanId: "LN10002", amount: 10247, date: "2026-02-20", status: "Paid", method: "UPI" },
  { id: "PAY010", loanId: "LN10003", amount: 27513, date: "2025-07-10", status: "Paid", method: "NEFT" },
  { id: "PAY011", loanId: "LN10003", amount: 27513, date: "2025-08-10", status: "Paid", method: "NEFT" },
  { id: "PAY012", loanId: "LN10003", amount: 27513, date: "2025-09-10", status: "Paid", method: "NEFT" },
  { id: "PAY013", loanId: "LN10003", amount: 27513, date: "2025-10-10", status: "Paid", method: "NEFT" },
  { id: "PAY014", loanId: "LN10003", amount: 27513, date: "2025-11-10", status: "Paid", method: "NEFT" },
  { id: "PAY015", loanId: "LN10003", amount: 27513, date: "2025-12-10", status: "Paid", method: "NEFT" },
  { id: "PAY016", loanId: "LN10003", amount: 27513, date: "2026-01-10", status: "Paid", method: "NEFT" },
  { id: "PAY017", loanId: "LN10003", amount: 27513, date: "2026-02-10", status: "Paid", method: "NEFT" },
  { id: "PAY018", loanId: "LN10005", amount: 20086, date: "2026-02-12", status: "Paid", method: "UPI" },
  { id: "PAY019", loanId: "LN10006", amount: 13388, date: "2026-01-01", status: "Paid", method: "Net Banking" },
  { id: "PAY020", loanId: "LN10006", amount: 13388, date: "2026-02-01", status: "Paid", method: "UPI" },
  { id: "PAY021", loanId: "LN10007", amount: 18321, date: "2025-08-15", status: "Paid", method: "NEFT" },
  { id: "PAY022", loanId: "LN10007", amount: 18321, date: "2025-09-15", status: "Paid", method: "NEFT" },
  { id: "PAY023", loanId: "LN10007", amount: 18321, date: "2025-10-15", status: "Paid", method: "NEFT" },
  { id: "PAY024", loanId: "LN10007", amount: 18321, date: "2025-11-15", status: "Paid", method: "NEFT" },
  { id: "PAY025", loanId: "LN10007", amount: 18321, date: "2025-12-15", status: "Paid", method: "NEFT" },
  { id: "PAY026", loanId: "LN10007", amount: 18321, date: "2026-01-15", status: "Paid", method: "UPI" },
  { id: "PAY027", loanId: "LN10007", amount: 18321, date: "2026-02-15", status: "Paid", method: "UPI" },
  { id: "PAY028", loanId: "LN10001", amount: 11823, date: "2026-03-15", status: "Upcoming", method: "—" },
  { id: "PAY029", loanId: "LN10002", amount: 10247, date: "2026-03-20", status: "Upcoming", method: "—" },
  { id: "PAY030", loanId: "LN10005", amount: 20086, date: "2026-03-12", status: "Upcoming", method: "—" }
];

export function seedDemoData() {
  // Only seed if no users exist in localStorage
  if (!localStorage.getItem("demo_seeded")) {
    localStorage.setItem("users", JSON.stringify(DEMO_USERS));
    localStorage.setItem("loans", JSON.stringify(DEMO_LOANS));
    localStorage.setItem("payments", JSON.stringify(DEMO_PAYMENTS));
    localStorage.setItem("demo_seeded", "true");
  }
}
