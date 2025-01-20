import { Link } from 'wasp/client/router'
import { GithubLogo } from '@phosphor-icons/react'

export function Footer() {
  return (
    <footer className='border-t'>
      <div className='mx-auto max-w-2xl px-4 py-10'>
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <Link to='/' className='text-sm font-medium'>
                steg
              </Link>
              <a
                href='https://github.com/wardbox/steg'
                target='_blank'
                rel='noreferrer'
                className='text-muted-foreground hover:text-foreground'
              >
                <GithubLogo className='h-4 w-4' />
              </a>
            </div>
            <div className='flex gap-4'>
              <Link
                to='/privacy'
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                privacy
              </Link>
              <Link
                to='/terms'
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                terms
              </Link>
              <Link
                to='/support'
                className='text-sm text-muted-foreground hover:text-foreground'
              >
                support
              </Link>
            </div>
          </div>
          <div className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} steg. all rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
