export default function () {

    const env = process.env.NEXT_PUBLIC_ENV;

    return (
        <div className="env-container">
            <span className="label">environment:</span> <span className="env">{env}</span>
        </div>
    );
}