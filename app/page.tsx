import { PiChefHat } from "react-icons/pi";
import Link from "next/link";
import RegisterLink from "@/components/general/RegisterLink";

export default function Home() {

  return (
    <div className="body" id="splash-page">

      <header>
        <h1>Recipe Database</h1>
      </header>

      <div className="splash-body">

        <div className="login-container">
          <Link href="./login"><span> <PiChefHat /> Login</span></Link>
        </div>

        <RegisterLink />
        
      </div>

    </div>
  );
}

