import { motion } from 'motion/react'
import { fadeIn } from '../motion/transitionPresets'
import { Button } from '../client/components/ui/button'
import { DiscordLogo, GithubLogo } from '@phosphor-icons/react'

export default function Support() {
  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={fadeIn}
      className='mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8'
    >
      <div className='space-y-8'>
        <h1 className='text-4xl font-light tracking-tight'>support</h1>

        <div className='space-y-8 text-sm text-muted-foreground'>
          <section className='space-y-4'>
            <h2 className='text-base font-medium text-foreground'>
              get in touch
            </h2>
            <p>We&apos;re here to help! Join our community:</p>
            <div className='flex flex-col gap-4 sm:flex-row'>
              <Button
                variant='outline'
                className='flex items-center gap-2'
                asChild
              >
                <a
                  href='https://discord.gg/UEsxypfaJE'
                  target='_blank'
                  rel='noreferrer'
                >
                  <DiscordLogo className='h-4 w-4' />
                  Join Discord
                </a>
              </Button>
              <Button
                variant='outline'
                className='flex items-center gap-2'
                asChild
              >
                <a
                  href='https://github.com/wardbox/steg/issues'
                  target='_blank'
                  rel='noreferrer'
                >
                  <GithubLogo className='h-4 w-4' />
                  Report an Issue
                </a>
              </Button>
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-base font-medium text-foreground'>
              frequently asked questions
            </h2>
            <div className='space-y-6'>
              <div className='space-y-2'>
                <h3 className='font-medium text-foreground'>
                  How do I create a new goal?
                </h3>
                <p>
                  Click the &quot;add&quot; button in the top right corner of
                  the dashboard. Fill in the goal details and click
                  &quot;create&quot;.
                </p>
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium text-foreground'>
                  How do I track my progress?
                </h3>
                <p>
                  Click the &quot;update&quot; button on any goal to log your
                  progress. For yes/no goals, simply click the checkmark. For
                  countable goals, enter your current value.
                </p>
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium text-foreground'>
                  Can I edit or delete a goal?
                </h3>
                <p>
                  You can delete a goal by clicking the trash icon that appears
                  when you hover over a goal. Currently, editing goals is not
                  supported - you&apos;ll need to delete and recreate the goal
                  with the desired changes.
                </p>
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium text-foreground'>
                  What are reverse goals?
                </h3>
                <p>
                  Reverse goals are for tracking metrics where lower numbers are
                  better (like reducing expenses or screen time). When creating
                  a countable goal, check the &quot;Reverse goal&quot; option to
                  indicate this.
                </p>
              </div>
            </div>
          </section>

          <section className='space-y-4'>
            <h2 className='text-base font-medium text-foreground'>feedback</h2>
            <p>
              We&apos;re always looking to improve. Join our Discord community
              to share your suggestions and feedback!
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
