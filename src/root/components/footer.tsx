import { Link } from 'wasp/client/router'
import { Footprints } from '@phosphor-icons/react'

export function Footer() {
  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center justify-center gap-8'>
        {/* Logo */}
        <Link to='/' className='flex items-center'>
          <div className='circle flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground'>
            <Footprints weight='bold' size={20} />
          </div>
          <span className='ml-3 text-lg font-bold'>Steg</span>
        </Link>

        {/* Links */}
        <div className='flex flex-wrap justify-center gap-8 text-sm text-muted-foreground'>
          <a href='/privacy' className='hover:text-foreground'>
            Privacy
          </a>
          <a href='/terms' className='hover:text-foreground'>
            Terms
          </a>
          <a
            href='mailto:support@steg.app'
            className='hover:text-foreground'
          >
            Support
          </a>
        </div>

        {/* Copyright */}
        <div className='text-center text-sm text-muted-foreground'>
          <p>&copy; {new Date().getFullYear()} Steg. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
