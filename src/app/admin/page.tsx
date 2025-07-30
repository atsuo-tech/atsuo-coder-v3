import styles from './page.module.css';
import Link from 'next/link';

export default function AdminPage(

) {
    return (
        <nav className={styles.nav}>
            <div className={styles.block}>
                <Link href="/admin">ホーム</Link>
            </div>
            <div className={styles.block}>
                <Link href="/admin/contest">コンテスト編集</Link>
            </div> 
            <div className={styles.block}>
                <Link href="/admin/task">問題編集</Link>
            </div> 
            <div className={styles.block}>
                <Link href="/admin/testcase">テストケース編集</Link>
            </div> 
            <div className={styles.block}>
                <Link href="/admin/notification">通知投稿（質問回答）</Link>
            </div> 
        </nav>
    );
}