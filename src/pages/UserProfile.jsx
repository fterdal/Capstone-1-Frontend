import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${userId}`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("User not found.");
        } else if (err.response?.status === 403) {
          setError("You are not authorized to view this profile.");
        } else {
          setError("Something went wrong.");
        }
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <img
          src={user.image || "https://static.vecteezy.com/system/resources/thumb…atar-profile-icon-of-social-media-user-vector.jpg"}
          alt={`${user.firstName}'s avatar`}
          className="user-profile-image"
        />
        <h2>
          {user.firstName} {user.lastName}
        </h2>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.isAdmin && <span className="admin-badge">Admin</span>}
      </div>
    </div>
  );
};
export default UserProfile;
