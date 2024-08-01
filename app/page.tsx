import { getAuthenticatedUserData } from "@/utils/cookie";
import Link from "next/link";

export default async function Home() {
	let isLogin: boolean;
	let user;
	try {
		user = await getAuthenticatedUserData();
		isLogin = true;
	} catch (error) {
		isLogin = false;
	}
	
	return (
		<main className="h-screen flex justify-center relative">
			<div className="absolute top-5 right-5">
				{isLogin
					?
					<div className="flex flex-row">
						<p className="border-r border-black pr-1">{user?.username as string}</p>
						<Link href={"/profile"} className="pl-1 hover:underline">Profile</Link>
					</div>
					:
					<>					
						<Link href={"/auth/login"} className="border-r border-black pr-1 hover:underline">Login</Link>
						<Link href={"/auth/register"} className="pl-1 hover:underline">Register</Link>
					</>
				}
			</div>
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
