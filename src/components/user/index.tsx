import Link from 'next/link';
import styles from './user.module.css';
import w_auth_db from '@/lib/w_auth_db';
import { ColoredUser } from './client';
import atsuocoder_db from '@/lib/atsuocoder_db';

export default async function User({ unique_id, ratingSystem }: { unique_id: string, ratingSystem?: string }) {

  const user = await w_auth_db.user.findFirst({
    where: {
      unique_id,
    },
  });

  const userData = await atsuocoder_db.userData.findFirst({
    where: {
      unique_id,
    },
    include: {
      Rating: ratingSystem ? {
        where: {
          ratingSystemUnique_id: ratingSystem,
        },
      } : true,
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
    <ColoredUser
      rating={userData?.Rating?.at(0)?.rating || 0}
      username={user.username}
      permission={user.permission}
    />
  );

}