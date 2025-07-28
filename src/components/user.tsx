import Link from 'next/link';
import styles from './user.module.css';

export default function User({ id }: { id: string }) {

  return (
    <Link href={`/users/${id}`} className={styles.user}>{id}</Link>
  );

}