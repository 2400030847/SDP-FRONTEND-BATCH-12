import UserCard from "./UserCard";

const UserList = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  return (
    <>
      {users.map((user, i) => (
        <UserCard key={i} user={user} />
      ))}
    </>
  );
};

export default UserList;