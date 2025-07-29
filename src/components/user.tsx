import Link from 'next/link';
import styles from './user.module.css';
import w_auth_db from '@/lib/w_auth_db';

export default async function User({ id }: { id: string }) {

  const user = await w_auth_db.user.findFirst({
    where: {
      username: id,
    },
  });

  if (!user) {

    throw new Error(`User ${id} not found`);

  }

  return (
    <Link href={`/users/${id}`} className={styles.user}>
      <div>
        {id}
      </div>
    </Link>
  );

}