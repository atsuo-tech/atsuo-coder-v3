import Link from 'next/link';
import styles from './user.module.css';
import w_auth_db from '@/lib/w_auth_db';

export default async function User({ unique_id }: { unique_id: string }) {

  const user = await w_auth_db.user.findFirst({
    where: {
      username: unique_id,
    },
  });

  if (!user) {

    return (
      <Link href={`/users/${unique_id}`} className={styles.user}>
        <div>
          {unique_id}
        </div>
      </Link>
    );

  }

  return (
    <Link href={`/users/${unique_id}`} className={styles.user}>
      <div>
        {unique_id}
      </div>
    </Link>
  );

}