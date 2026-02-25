import { useAuth } from "@/contexts/AuthContext";

const UserGreeting = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  // Capitalize first letter of username
  const displayName = user.username.charAt(0).toUpperCase() + user.username.slice(1);

  return (
    <div className="text-center mb-4 animate-fade-in">
      <p className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">
        {getGreeting()}, {displayName}!
      </p>
    </div>
  );
};

export default UserGreeting;

