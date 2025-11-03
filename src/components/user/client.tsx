import Link from 'next/link';
import styles from './user.module.css';

function getColorByRating(rating: number): string {

  if (rating >= 2400) {
    return "red";
  } else if (rating >= 2000) {
    return "orange";
  } else if (rating >= 1600) {
    return "purple";
  } else if (rating >= 1200) {
    return "blue";
  } else if (rating >= 800) {
    return "green";
  } else if (rating >= 400) {
    return "gray";
  } else {
    return "black";
  }

}

export function ColoredUser({ rating, username, permission }: { rating: number, username: string, permission: string }) {

  return (
    <Link href={`/users/${username}`} className={styles.user}>
      <div style={{ color: getColorByRating(rating), fontWeight: 'bold' }}>
        {
          permission == "Admin" ?
            <>
              <span style={{ color: "#295ebe" }}>{username.substring(0, Math.floor(username.length / 2))}</span>
              <span>{username.substring(Math.floor(username.length / 2))}</span>
            </> :
            permission == "SuperAdmin" ?
              <>
                <span style={{ color: "#e83f94" }}>{username.substring(0, Math.floor(username.length / 2))}</span>
                <span>{username.substring(Math.floor(username.length / 2))}</span>
              </> :
              username
        }
      </div>
    </Link>
  )

}