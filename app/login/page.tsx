import LoginForm from "@/components/login/LoginForm";

export default function Home() {

  return (
    <div className="body" id="login-page">

      {/* <h1>Recipe Database</h1> */}

      <div className="login-container">
        <LoginForm />
      </div>

    </div>
  );
}