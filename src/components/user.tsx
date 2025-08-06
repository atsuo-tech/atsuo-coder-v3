import Link from 'next/link';
import styles from './user.module.css';
import w_auth_db from '@/lib/w_auth_db';

export default async function User({ unique_id }: { unique_id: string }) {

  const user = await w_auth_db.user.findFirst({
    where: {
      unique_id,
    },
  });

  if (!user) {

    return (
      <Link href="#" className={styles.user}>
        <div>
          {unique_id}
        </div>
      </Link>
    );

  }

  return (
    <Link href={`/users/${user.username}`} className={styles.user}>
      <div>
        {user.username}
      </div>
    </Link>
  );

}