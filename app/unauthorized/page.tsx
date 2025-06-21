import LogoutButton from "@/components/profile/LogoutButton";

export default function Unauthorized() {

    return (
        <div id="unauthorized-page">
            <h1>Who tf are you? Non admin.</h1>
            <LogoutButton />
        </div>
    );
}