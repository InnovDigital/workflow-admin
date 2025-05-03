import Link from "next/link"

export default function Home() {
  return (
    <div className="text-3xl font-bold underline text-pink-500">
      <p>Dashboard Home</p>
      <div className="mt-4 space-x-4">
        <Link href="/dashboard">
          <a className="text-blue-500 hover:underline">Go to Dashboard</a>
        </Link>
        <Link href="/login">
          <a className="text-blue-500 hover:underline">Go to Login</a>
        </Link>
      </div>
    </div>
  )
}