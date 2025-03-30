"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSidebar } from "@/hooks/use-sidebar"

export function MainNav() {
  const pathname = usePathname()
  const { toggle } = useSidebar()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background">
      <div className="flex h-16 items-center px-4">
      <Button variant="ghost" size="icon" onClick={toggle} className="mr-4">
        <Menu className="h-5 w-5" />
      </Button>
        <div className="flex items-center space-x-2 px-4">
          <span className="text-xl font-bold">WAV</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}