import Link from 'next/link';
import React from 'react';
import styles from './layout.module.css';

export default async function AdminLayout(
	{
		children,
	}: {
		children: React.ReactNode
	}
) {

	return (
		<div>
			<nav className={styles.nav}>
				<div className={styles.block}>
					<Link href="/admin">ホーム</Link>
				</div>
				<div className={styles.block}>
					<Link href="/admin/contest">コンテスト</Link>
				</div>
				<div className={styles.block}>
					<Link href="/admin/task">問題</Link>
				</div>
				<div className={styles.block}>
					<Link href="/admin/testcase">テストケース</Link>
				</div>
				<div className={styles.block}>
					<Link href="/admin/notification">投稿</Link>
				</div>
			</nav>
			{children}
		</div>
	)

}