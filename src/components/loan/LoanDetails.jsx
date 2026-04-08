const LoanDetails = ({ loan }) => {
  return (
    <div className="card">
      <h3>{loan.id}</h3>
      <p>Name: {loan.name}</p>
      <p>Type: {loan.type}</p>
      <p>Amount: ₹{loan.amount}</p>
      <p>Date: {loan.date}</p>
      <p>Status: {loan.status}</p>
    </div>
  );
};

export default LoanDetails;