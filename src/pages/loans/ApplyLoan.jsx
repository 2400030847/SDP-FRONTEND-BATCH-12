import Layout from "../../components/layout/Layout";
import LoanForm from "../../components/loan/LoanForm";

const ApplyLoan = () => {
  return (
    <Layout>
      <div className="dashboard-container">
        <div className="page-header">
          <h2>📝 Apply for a Loan</h2>
        </div>
        <div className="dashboard-section">
          <LoanForm />
        </div>
      </div>
    </Layout>
  );
};

export default ApplyLoan;