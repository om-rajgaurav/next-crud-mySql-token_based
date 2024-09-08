import { cookies } from "next/headers"
import Home from "@/components/Home"


export default function HomePage() {
 
  const token = cookies().get("token")?.value as string | undefined
  return (
    <Home token={token}  />
  )
}
