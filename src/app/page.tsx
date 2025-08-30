import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect homepage to dashboard (avoids duplication)
  redirect('/dashboard')
}
