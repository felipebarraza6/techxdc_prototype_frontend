import { useContext } from "react";
import UserContext from "../context/UserContext";

export default function UserProfile() {
  const context = useContext(UserContext);

  if (!context) return null;

  const { user } = context.globalState;

  if (!user || !user.id) return null;

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Usuario: {user.name} {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      <p>Token: {user.token}</p>
    </div>
  );
}
