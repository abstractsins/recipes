import { useFetchUsers } from "@/hooks/useFetchUsers";
import styles from './Select.module.css';

interface Props {
    onSelect?: (value: string) => void;
}

export default function UserSelect({ onSelect }: Props) {

    const { users } = useFetchUsers();

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        if (onSelect) {
            onSelect(selectedValue);
        }
    }

    return (
        <select onChange={handleSelect} className={styles["admin-select"]} name="user" defaultValue={'User'}>
            <option value="null" label="Select User"></option>
            {
                users.map(el => (
                    <option key={el.id}>
                        {`${el.id}: ${el.username} -- ${el.nickname}, ${el.email}`}
                    </option>
                ))
            }
        </select>
    );
}