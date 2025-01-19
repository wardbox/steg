import { useMotion } from '../motion/motion-provider'
import { fadeIn, staggerContainer } from '../motion/transitionPresets'
import { motion } from 'motion/react'
import { Plus, Target, Bell } from '@phosphor-icons/react'
import { Button } from '../client/components/ui/button'
import { Link } from 'wasp/client/router'

export default function Landing() {
  const { transition, key } = useMotion()

  return (
    <div className='mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8'>
      <motion.div
        key={key}
        variants={staggerContainer}
        initial='hidden'
        animate='show'
        exit='exit'
        transition={transition}
        className='flex flex-col items-center justify-center gap-16'
      >
        {/* Hero Section */}
        <motion.section variants={fadeIn} className='text-center'>
          <div className='mb-8 flex items-center justify-center'>
            <div className='circle flex h-16 w-16 items-center justify-center bg-primary text-primary-foreground'>
              <Target weight='bold' size={32} />
            </div>
          </div>
          <h1 className='text-4xl font-bold tracking-tight sm:text-6xl'>
            Steg
          </h1>
          <p className='mt-6 text-lg text-muted-foreground'>
            Step by step. Goal by goal.
          </p>
        </motion.section>

        {/* Features Grid */}
        <motion.section variants={fadeIn} className='w-full'>
          <div className='geometric-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='geometric-card p-6'>
              <div className='circle mb-4 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground'>
                <Plus weight='bold' size={24} />
              </div>
              <h3 className='mb-2 text-xl font-bold'>Daily Goals</h3>
              <p className='text-muted-foreground'>
                Track your progress day by day with simple yes/no checkoffs
              </p>
            </div>

            <div className='geometric-card p-6'>
              <div className='circle mb-4 flex h-12 w-12 items-center justify-center bg-accent text-accent-foreground'>
                <Target weight='bold' size={24} />
              </div>
              <h3 className='mb-2 text-xl font-bold'>Countable Goals</h3>
              <p className='text-muted-foreground'>
                Set targets and track numerical progress over time
              </p>
            </div>

            <div className='geometric-card p-6'>
              <div className='circle mb-4 flex h-12 w-12 items-center justify-center bg-tertiary text-tertiary-foreground'>
                <Bell weight='bold' size={24} />
              </div>
              <h3 className='mb-2 text-xl font-bold'>Reminders</h3>
              <p className='text-muted-foreground'>
                Stay on track with daily notifications
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section variants={fadeIn} className='text-center'>
          <Button asChild size='lg' className='geometric-button bg-primary text-primary-foreground hover:bg-primary/90'>
            <Link to='/signup'>Start Your Journey</Link>
          </Button>
        </motion.section>
      </motion.div>

      {/* Floating Action Button */}
      <div className='floating-panel'>
        <Button size='icon' className='add-button'>
          <Plus weight='bold' size={24} />
          <span className='sr-only'>Create new goal</span>
        </Button>
      </div>
    </div>
  )
}
