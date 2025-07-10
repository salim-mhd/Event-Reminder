import LoginForm from "@/components/auth/LoginForm";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "@/styles/globals.css";

const LoginPage = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
