import * as React from 'react'
import { useState } from 'react'
import { cn, usePrefetch } from '../../lib/utils'
import { Link } from 'wasp/client/router'
import {
  Footprints,
  List,
  SignIn,
  SignOut,
  User as UserIcon,
} from '@phosphor-icons/react'
import { ModeToggle } from '../../client/components/mode-toggle'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../client/components/ui/sheet'
import { Button } from '../../client/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../client/components/ui/dropdown-menu'
import { logout } from 'wasp/client/auth'
import { type User } from 'wasp/entities'
import { Skeleton } from '../../client/components/ui/skeleton'

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  user?: User | null
  userLoading?: boolean
}

const Nav = React.forwardRef<HTMLElement, NavProps>(
  ({ user, userLoading, ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const prefetch = usePrefetch()

    const handleNavigation = () => {
      setOpen(false)
    }

    return (
      <nav
        ref={ref}
        className={cn(
          'sticky top-0 z-50 w-full bg-background',
          props.className,
        )}
        {...props}
      >
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-8'>
            <Link
              to='/'
              className='flex items-center'
              onMouseEnter={() => prefetch('/', undefined, { assets: true })}
            >
              <div className='circle flex h-10 w-10 items-center justify-center bg-primary text-primary-foreground'>
                <Footprints weight='bold' size={24} />
              </div>
              <span className='ml-3 text-xl font-bold'>Steg</span>
            </Link>
            <Link
              to='/dashboard'
              onMouseEnter={() => prefetch('/dashboard', undefined, { assets: true })}
            >
              <span className='ml-3 text-xl font-bold'>Dashboard</span>
            </Link>
          </div>

          <div className='flex items-center gap-4'>
            <ModeToggle iconSize='md' />
            {/* Desktop Menu */}
            <div className='hidden items-center md:flex'>
              {userLoading ? (
                <Skeleton className='h-10 w-10' />
              ) : (
                <div className='flex items-center animate-in fade-in'>
                  {user ? (
                    <DropdownMenu
                      open={dropdownOpen}
                      onOpenChange={setDropdownOpen}
                      modal={false}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='outline'
                          size='icon'
                          className='geometric-button'
                        >
                          <UserIcon size={24} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='geometric-card'>
                        <Link
                          to='/profile/:id'
                          params={{ id: user.id }}
                          onMouseEnter={() =>
                            prefetch('/profile/:id', { id: user.id })
                          }
                          onClick={() => setDropdownOpen(false)}
                          className='cursor-pointer'
                        >
                          <DropdownMenuItem>Profile</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='cursor-pointer text-destructive'
                          onClick={() => {
                            setDropdownOpen(false)
                            logout()
                          }}
                        >
                          <SignOut className='mr-2' size={18} />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className='flex gap-2'>
                      <Button asChild variant='outline' className='geometric-button'>
                        <Link to='/login' className='flex items-center gap-2'>
                          <SignIn size={18} />
                          Log in
                        </Link>
                      </Button>
                      <Button asChild className='geometric-button'>
                        <Link to='/signup'>Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className='md:hidden'>
                <Button variant='outline' size='icon' className='geometric-button'>
                  <List size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='geometric-card w-[300px] p-0'>
                <SheetHeader className='p-6'>
                  <SheetTitle className='text-2xl font-bold'>Menu</SheetTitle>
                </SheetHeader>
                <div className='flex flex-col gap-1 p-2'>
                  {userLoading ? (
                    <Skeleton className='h-10 w-full' />
                  ) : user ? (
                    <>
                      <Link
                        to='/profile/:id'
                        params={{ id: user.id }}
                        className='geometric-button w-full p-4 text-left hover:bg-muted'
                        onClick={handleNavigation}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          handleNavigation()
                        }}
                        className='geometric-button w-full p-4 text-left text-destructive hover:bg-muted'
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <div className='space-y-2 p-4'>
                      <Button
                        asChild
                        variant='outline'
                        className='geometric-button w-full'
                      >
                        <Link to='/login'>Log in</Link>
                      </Button>
                      <Button asChild className='geometric-button w-full'>
                        <Link to='/signup'>Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    )
  },
)

Nav.displayName = 'Nav'

export { Nav }
