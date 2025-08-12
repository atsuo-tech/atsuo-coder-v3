import Link from 'next/link';
import styles from './page.module.css';
import LogoMono from '@/img/logo-mono.svg';
import { OutlinedIcon } from '@/components/material-symbols';
import atsuocoder_db from '@/lib/atsuocoder_db';
import User from '@/components/user';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Markdown from '@/components/markdown';

export default async function MainPage() {

    // Next-4 Contests + Last-1 Contest
    const next_contests = await atsuocoder_db.contest.findMany({
        where: {
            end_time: {
                gt: new Date(),
            },
            is_public: true,
            is_permanent: false,
        },
        orderBy: {
            start_time: "asc",
        },
        take: 4,
    });
    const last_contests = await atsuocoder_db.contest.findMany({
        where: {
            end_time: {
                lte: new Date(),
            },
            is_public: true,
            is_permanent: false,
        },
        orderBy: {
            start_time: "desc",
        },
        take: 1,
    });

    const ranked_users = await atsuocoder_db.userData.findMany({
        orderBy: {
            rating: "desc",
        },
        take: 10,
    });

    const notifications = await atsuocoder_db.notification.findMany({
        where: {
            isPublic: true,
        },
        orderBy: {
            created_at: "desc",
        },
        take: 1,
    });

    return (
        <div className={styles.page}>
            <div className={styles.title}>
                <div className={styles.logo}>
                    <LogoMono height="80%" />
                </div>
                <div className={styles.description}>
                    <div>
                        <span>Our mission is...</span>
                        <h1>To Spread <b style={{ color: "#e6e600" }}>WA</b> to the members</h1>
                        <p>
                            <b>AtsuoCoder</b> is the best competitive programming service in Waseda.<br />
                            You can compete in real-time online contests, <br />
                            and also solve past problems at least 0.
                        </p>
                    </div>
                </div>
            </div>

            <div
                className={styles.menu}
            >
                <div
                    className={styles.contests}
                >

                    <h3>Latest Contests</h3>

                    {
                        next_contests.map((contest, i) =>
                            <div key={i}>
                                <span
                                    className={styles.type}
                                >
                                    {
                                        contest.start_time.getTime() >= Date.now() ?
                                            "予定" :
                                            "開催中"
                                    }
                                </span>
                                <span
                                    className={styles.schedule}
                                >
                                    {contest.start_time.toLocaleString("ja-jp")} 開始
                                </span>
                                <Link href={`/contests/${contest.url_id}`}>
                                    <h4>{contest.title}</h4>
                                </Link>
                            </div>
                        )
                    }

                    {
                        last_contests.map((contest, i) =>
                            <div key={i}>
                                <span
                                    className={styles.type}
                                    style={{ background: "gray" }}
                                >
                                    終了
                                </span>
                                <span
                                    className={styles.schedule}
                                >
                                    {contest.start_time.toLocaleString("ja-jp")} 開始
                                </span>
                                <Link href={`/contests/${contest.url_id}`}>
                                    <h4>{contest.title}</h4>
                                </Link>
                            </div>
                        )
                    }

                    <div
                        className={styles.see_more}
                    >
                        <p>
                            <Link href="/contests">
                                <OutlinedIcon>east</OutlinedIcon>
                                See All Contests
                            </Link>
                        </p>
                    </div>

                </div>
                <div
                    className={styles.rankings}
                >

                    <h3>Rankings</h3>

                    <div>
                        <Table>
                            <TableBody>
                                {
                                    ranked_users.map((user, i) =>
                                        <TableRow key={i}>
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell><User unique_id={user.unique_id} /></TableCell>
                                            <TableCell>{user.rating}</TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                    </div>

                    <div
                        className={styles.see_more}
                    >
                        <p>
                            <Link href="/rankings">
                                <OutlinedIcon>east</OutlinedIcon>
                                See More
                            </Link>
                        </p>
                    </div>

                </div>
                <div
                    className={styles.posts}
                >

                    <h3>Posts</h3>

                    {
                        notifications.map((notification, i) =>
                            <div key={i}>
                                <h4>{notification.title}</h4>
                                <Markdown md={notification.description} />
                            </div>
                        )
                    }

                    <div
                        className={styles.see_more}
                    >
                        <p>
                            <Link href="/posts">
                                <OutlinedIcon>east</OutlinedIcon>
                                See More
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}