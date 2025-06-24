import styles from './TagSkeletons.module.css';

export default function TagSkeletons() {
    return (
        <>
            <div className={`${styles['checkbox-container']}`}>
                <label className={`${styles['skeleton']} skeleton disabled`}></label>
            </div>
            <div className={`${styles['checkbox-container']}`}>
                <label className={`${styles['skeleton']} skeleton disabled`}></label>
            </div>
            <div className={`${styles['checkbox-container']}`}>
                <label className={`${styles['skeleton']} skeleton disabled`}></label>
            </div>
            <div className={`${styles['checkbox-container']}`}>
                <label className={`${styles['skeleton']} skeleton disabled`}></label>
            </div>
        </>
    )
}