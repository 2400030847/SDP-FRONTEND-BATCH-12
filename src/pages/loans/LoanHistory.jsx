import Layout from "../../components/layout/Layout";
import LoanList from "../../components/loan/LoanList";

const LoanHistory = () => {
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="page-header">
          <h2>📋 Loan History</h2>
        </div>
        <LoanList />
      </div>
    </Layout>
  );
};

export default LoanHistory;