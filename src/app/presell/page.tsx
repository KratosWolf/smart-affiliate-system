import { redirect } from 'next/navigation'

export default function PresellRedirect() {
  // Server-side redirect
  redirect('/presell-generator')
}