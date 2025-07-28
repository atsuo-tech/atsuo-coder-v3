import Link from 'next/link';
import styles from './page.module.css';
import LogoMono from '@/img/logo-mono.svg';
import { OutlinedIcon } from '@/components/material-symbols';

export default function MainPage() {
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

                    <div>
                        <span
                            className={styles.type}
                        >
                            予定
                        </span>
                        <span
                            className={styles.schedule}
                        >
                            2025/07/28 開始
                        </span>
                        <h4>AtsuoCoder World Tour Finals</h4>
                    </div>

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
                <div>

                    <h3>Rankings</h3>

                    <div>
                        <p>
                            1. yama_can <br /> <br />
                            2. abn48 <br /> <br />
                            3. tomo8 <br /> <br />
                            4. houjitya <br /> <br />
                            5. iseetell <br /> <br />
                            6. nikkuni <br /> <br />
                            NaN. okkuu <br /> <br />
                        </p>
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

                    <div>
                        <h4>AtsuoCoder World Tour Finals 2025 告知</h4>
                        <p>
                            AtsuoCoder World Tour Finals 2025 が開催されます。
                            <br />
                            AtsuoCoder World Tour Finals 2025 は、早稲田中高PCプログラミング部員を越後に招いて開催される国内オンサイトコンテストです。
                            <br />
                            当日は和風いん越路のホワイトボードでコンテストの様子を配信いたします。
                            <br />
                            詳しくは合宿のしおりをご覧ください．
                        </p>
                    </div>

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