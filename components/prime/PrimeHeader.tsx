import Environment from "../admin/Environment";
import Greeting from "../Greeting";
import HeaderButtons from "../HeaderButtons";

interface Props {
    nickname: string | undefined;
    role: string | undefined;
}

export default function PrimeHeader({ nickname, role }: Props) {

    return (
        <header className="prime-header">
            <Environment />
            <Greeting nickname={nickname} />
            <HeaderButtons role={role} profileView={false} />
        </header>
    )
}