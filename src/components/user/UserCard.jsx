const UserCard = ({ user }) => {
  return (
    <div className="card">
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default UserCard;