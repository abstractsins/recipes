import Link from "next/link"

export default function RegisterLink() {
    return (
        <div className="register-container">
            <div>
                <span>New to the site? <Link className="link" href="./register">Register here.</Link></span>
            </div>
        </div>
    )
}