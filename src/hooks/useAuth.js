import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook to access authentication context
const useAuth = () => {
    const context = useContext(AuthContext);

    // Ensure hook is used inside AuthProvider
    if (!context) throw new Error("useAuth must be used inside AuthProvider");

    return context;
};

export default useAuth;