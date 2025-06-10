
export default function Greeting({ nickname }: { nickname: string | undefined }) {

    return (
        <div className="greeting-container">
            <span>Hello, {nickname}</span>
        </div>
    );
}