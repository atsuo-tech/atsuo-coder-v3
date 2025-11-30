import styles from './not-found.module.css';
import Logo from '@/img/logo-titled.svg';

export default async function NotFoundPage() {

	return (
		<main
			className={styles.not_found}
		>

			<div>

				<h1>Not Found!!</h1>

				<Logo height="100px" width="100%" />

			</div>

		</main>
	)

}