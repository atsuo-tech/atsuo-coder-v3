export default function AdminTestcasePage() {

	return (
		<main>

			<h1>Testset / Testcase Management</h1>

			<details>
				<summary>Testset / Testcase について</summary>
				Testset は Testcase を複数集めたもので、それぞれの Testcase の結果によりその Testset の点数が決まります。
				<br />
				問題で得られる得点は Testset で得られた点の総和です。
				<br />
				Testset には 3 タイプあり、"Unanimous", "Max", "Sum" です。
				<br />
				<ul>
					<li>"Unanimous" を選択した場合はすべての Testcase で評価された点が同じ際にその点が点数となります。</li>
					<li>"Max" を選択した場合はすべての Testcase で評価された点の最大値が点数となります。</li>
					<li>"Sum" を選択した場合はすべての Testcase で評価された点の総和が点数となります。</li>
				</ul>
			</details>

			<h2>テストセット一覧</h2>
			<h2>テストケース一覧</h2>

		</main>
	);

}