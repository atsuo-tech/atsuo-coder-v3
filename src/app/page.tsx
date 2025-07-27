import Image from 'next/image';
import styles from './page.module.css';
import Logo from '@/img/logo.svg';

export default function MainPage() {
    return (
        <div className={styles.page}>
            <div className={styles.title}>
                <div className={styles.logo}>
                    <Logo />
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
            <p>This is the main content of the page.</p>
        </div>
    );
}