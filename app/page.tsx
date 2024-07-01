import Link from "next/link";

export default function Home() {
	return (
		<main className="h-screen flex justify-center">
			<div className="mt-20">
				<h1 className="text-center text-4xl mb-1">Welcome</h1>
				<Link href={"/map"}>
					<button type="button" className="bg-neutral-200 hover:bg-neutral-300 rounded-md p-3 text-xm text-center inline-flex items-center">
						Search for nearby stores
						<svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
							<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
						</svg>
					</button>
				</Link>
			</div>
		</main>
	);
}
