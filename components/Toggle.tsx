interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Toggle({ onChange }: Props) {

    return (
        <>
            <div className="toggle-wrapper">
                <input className="toggle-checkbox" type="checkbox" onChange={onChange} />
                <div className="toggle-container">
                    <div className="toggle-button"></div>
                </div>
            </div>

        </>
    );
}