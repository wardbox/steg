import { useQuery, getGoals } from 'wasp/client/operations'
import { Plus } from '@phosphor-icons/react'
import { Button } from '../client/components/ui/button'
import { Card } from '../client/components/ui/card'
import { motion } from 'motion/react'
import { staggerContainer, staggerItem } from '../motion/transitionPresets'
import { useMotion } from '../motion/motion-provider'
import { type Goal, type GoalProgress } from 'wasp/entities'

interface GoalWithProgress extends Goal {
  progress: GoalProgress[]
}

export function DashboardPage() {
  const { data: goals, isLoading, error } = useQuery(getGoals)
  const { transition, key } = useMotion()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <motion.div
      key={key}
      variants={staggerContainer}
      initial='hidden'
      animate='show'
      exit='exit'
      transition={transition}
      className='container mx-auto space-y-8 py-8'
    >
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold'>Your Goals</h1>
        <Button size='icon' className='add-button'>
          <Plus weight='bold' size={24} />
          <span className='sr-only'>Add new goal</span>
        </Button>
      </div>

      {goals.length === 0 ? (
        <motion.div
          variants={staggerItem}
          className='flex flex-col items-center justify-center gap-4 py-12 text-center'
        >
          <h2 className='text-2xl font-semibold'>No goals yet</h2>
          <p className='text-muted-foreground'>
            Click the + button to create your first goal
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          className='geometric-grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
        >
          {goals.map((goal: GoalWithProgress) => (
            <motion.div key={goal.id} variants={staggerItem}>
              <Card className='geometric-card p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-xl font-bold'>{goal.name}</h3>
                  <div className='circle flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground'>
                    {goal.type === 'COUNTABLE' ? (
                      <span className='tabular-nums'>
                        {goal.progress[0]?.value || 0}/{goal.targetValue}
                      </span>
                    ) : (
                      <span>{goal.progress[0]?.value ? '✓' : '○'}</span>
                    )}
                  </div>
                </div>
                <div className='flex items-center justify-between text-sm text-muted-foreground'>
                  <span>
                    {new Date(goal.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <Button variant='outline' size='sm' className='geometric-button'>
                    Update
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
} 
