import { useMotion } from '../motion/motion-provider'
import {
  fadeIn,
  staggerContainer,
  staggerItem,
  hoverScale,
  slideInUp,
} from '../motion/transitionPresets'
import { motion } from 'motion/react'
import { Button } from '../client/components/ui/button'
import { Link } from 'wasp/client/router'

export default function Landing() {
  const { transition, key } = useMotion()

  return (
    <div className='mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8'>
      <motion.div
        key={key}
        variants={staggerContainer}
        initial='hidden'
        animate='show'
        exit='exit'
        transition={transition}
        className='flex flex-col gap-12'
      >
        {/* Header */}
        <motion.section variants={fadeIn} className='space-y-6'>
          <div className='space-y-6'>
            <motion.div variants={slideInUp} className='space-y-1'>
              <h1 className='text-5xl font-medium tracking-tight'>steg</h1>
              <div className='flex items-baseline gap-2 text-sm text-muted-foreground'>
                <span className='italic'>noun</span>
                <span className='font-mono'>/steːɡ/</span>
              </div>
            </motion.div>

            <div className='space-y-6'>
              <motion.div variants={staggerItem} className='space-y-2'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-primary'>step</span>
                  <span className='text-xs italic text-muted-foreground'>
                    [noun]
                  </span>
                  <span>a stage in progress, development etc.</span>
                </div>
                <p className='pl-4 text-sm italic text-muted-foreground'>
                  • Humanity made a big step forward with the invention of the
                  wheel.
                </p>
                <p className='pl-4 text-sm italic text-muted-foreground'>
                  • The new role was a step up from the previous position.
                </p>
              </motion.div>

              <motion.div variants={staggerItem} className='space-y-2'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-primary'>pace</span>
                  <span className='text-xs italic text-muted-foreground'>
                    [noun]
                  </span>
                  <span>a step</span>
                </div>
                <p className='pl-4 text-sm italic text-muted-foreground'>
                  • They took a pace forward.
                </p>
              </motion.div>
            </div>
          </div>
          <motion.div variants={fadeIn} className='h-px w-full bg-border' />
        </motion.section>

        {/* Features */}
        <motion.section variants={fadeIn} className='space-y-8'>
          {/* Core Features */}
          <motion.div variants={staggerItem} className='space-y-4'>
            <h2 className='text-2xl font-medium'>features</h2>
            <div className='space-y-3'>
              {[
                'track daily habits and routines',
                'measure progress with numbers',
                'get gentle reminders when needed',
                'visualize your achievements',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className='flex items-center gap-3'
                >
                  <div className='h-1 w-1 rounded-full bg-foreground' />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section variants={fadeIn} className='space-y-3'>
          <motion.div variants={hoverScale}>
            <Button
              asChild
              size='lg'
              className='h-12 w-full rounded-none bg-foreground px-8 text-base text-background hover:bg-foreground/90 sm:w-auto'
            >
              <Link to='/signup'>signup</Link>
            </Button>
          </motion.div>
          <motion.p
            variants={staggerItem}
            className='text-xs text-muted-foreground'
          >
            free and open source • no credit card required
          </motion.p>
        </motion.section>
      </motion.div>
    </div>
  )
}
