import * as React from 'react'
import { useState } from 'react'
import { cn, usePrefetch } from '../../lib/utils'
import { Link } from 'wasp/client/router'
import { SignIn, SignOut, User as UserIcon, List } from '@phosphor-icons/react'
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
          'sticky top-0 z-50 w-full border-b border-border bg-background',
          props.className,
        )}
        {...props}
      >
        <div className='mx-auto flex h-16 max-w-2xl items-center justify-between px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-8'>
            <Link
              to='/'
              className='flex items-center'
              onMouseEnter={() => prefetch('/', undefined, { assets: true })}
            >
              <span className='text-xl font-medium tracking-tight'>steg</span>
            </Link>
            <Link
              to='/dashboard'
              onMouseEnter={() =>
                prefetch('/dashboard', undefined, { assets: true })
              }
              className='text-sm text-muted-foreground hover:text-foreground'
            >
              dashboard
            </Link>
          </div>

          <div className='flex items-center gap-4'>
            {/* Desktop Menu */}
            <div className='hidden items-center md:flex'>
              {userLoading ? (
                <Skeleton className='h-8 w-8' />
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
                          className='h-8 w-8 rounded-none'
                        >
                          <UserIcon size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='rounded-none'>
                        <Link
                          to='/profile/:id'
                          params={{ id: user.id }}
                          onMouseEnter={() =>
                            prefetch('/profile/:id', { id: user.id })
                          }
                          onClick={() => setDropdownOpen(false)}
                          className='cursor-pointer'
                        >
                          <DropdownMenuItem>profile</DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='cursor-pointer text-destructive'
                          onClick={() => {
                            setDropdownOpen(false)
                            logout()
                          }}
                        >
                          <SignOut className='mr-2' size={16} />
                          log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className='flex gap-2'>
                      <Button
                        asChild
                        variant='outline'
                        className='h-8 rounded-none px-3 text-sm'
                      >
                        <Link to='/login' className='flex items-center gap-2'>
                          <SignIn size={16} />
                          log in
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className='h-8 rounded-none bg-foreground px-3 text-sm text-background hover:bg-foreground/90'
                      >
                        <Link to='/signup'>sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className='md:hidden'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-8 w-8 rounded-none'
                >
                  <List size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-[300px] rounded-none p-0'>
                <SheetHeader className='p-6'>
                  <SheetTitle className='text-lg font-medium tracking-tight'>
                    menu
                  </SheetTitle>
                </SheetHeader>
                <div className='flex flex-col gap-1 p-2'>
                  {userLoading ? (
                    <Skeleton className='h-8 w-full' />
                  ) : user ? (
                    <>
                      <Link
                        to='/profile/:id'
                        params={{ id: user.id }}
                        className='w-full p-4 text-left hover:bg-muted'
                        onClick={handleNavigation}
                      >
                        profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          handleNavigation()
                        }}
                        className='w-full p-4 text-left text-destructive hover:bg-muted'
                      >
                        log out
                      </button>
                    </>
                  ) : (
                    <div className='space-y-2 p-4'>
                      <Button
                        asChild
                        variant='outline'
                        className='h-8 w-full rounded-none text-sm'
                      >
                        <Link to='/login'>log in</Link>
                      </Button>
                      <Button
                        asChild
                        className='h-8 w-full rounded-none bg-foreground text-sm text-background hover:bg-foreground/90'
                      >
                        <Link to='/signup'>sign up</Link>
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
