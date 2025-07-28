import styles from './page.module.css';
import LogoMono from '@/img/logo-mono.svg';

export default function MainPage() {
    return (
        <div className={styles.page}>
            <div className={styles.title}>
                <div className={styles.logo}>
                    <LogoMono height="80%" />
                </div>
                <div>
                    <div>
                        <h1>Spread <b>WA</b> to the members.</h1>
                        <p>
                            <b>AtsuoCoder</b> is the best competitive programming service in Waseda.<br />
                            You can compete in real-time online contests, <br />
                            and also solve past problems at least 0.
                        </p>
                    </div>
                </div>
            </div>

            <main>

                <div
                    className={styles.menu}
                >
                    <div>

                        <h3>最新コンテスト</h3>

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

                    </div>
                    <div>

                        <h3>ランキング</h3>

                    </div>
                    <div>

                        <h3>お知らせ</h3>

                    </div>
                </div>

            </main>
        </div>
    );
}