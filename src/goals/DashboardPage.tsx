import { useQuery, getGoals, createGoal, updateGoalProgress, deleteGoal } from 'wasp/client/operations'
import { Plus, Minus, Check, X, Trash } from '@phosphor-icons/react'
import { Button } from '../client/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../client/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../client/components/ui/form'
import { Input } from '../client/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../client/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { type Goal, type GoalProgress } from 'wasp/entities'
import { formatDistanceToNow, addDays, addWeeks, addMonths } from 'date-fns'
import { motion } from 'motion/react'
import { fadeIn, staggerContainer } from '../motion/transitionPresets'

interface GoalWithProgress extends Goal {
  progress: GoalProgress[]
  isReverse: boolean
}

const createGoalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['COUNTABLE', 'YES_NO']),
  category: z.enum(['HEALTH', 'FINANCE', 'CAREER', 'EDUCATION', 'PERSONAL', 'SOCIAL', 'CREATIVE', 'OTHER']),
  frequency: z.enum(['ONE_TIME', 'DAILY', 'WEEKLY', 'MONTHLY', 'ANNUAL', 'CUSTOM']),
  cycleLength: z.number().nullable().refine(val => {
    if (val === null) return true;
    return val >= 1;
  }, {
    message: 'Cycle length must be at least 1',
  }),
  cycleUnit: z.enum(['days', 'weeks', 'months']).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  targetValue: z.number().nullable(),
  isReverse: z.boolean().default(false),
  endDate: z.string().optional(),
}).refine(data => {
  // If frequency is CUSTOM, both cycleLength and cycleUnit are required
  if (data.frequency === 'CUSTOM') {
    return data.cycleLength != null && data.cycleUnit != null;
  }
  return true;
}, {
  message: 'Cycle length and unit are required for custom frequency',
  path: ['cycleLength'] // Show error on cycleLength field
});

type CreateGoalFormData = z.infer<typeof createGoalSchema>

function NumberInput({
  value,
  onChange,
  placeholder,
  allowNull = false
}: {
  value: number | undefined | null
  onChange: (value: number | undefined | null) => void
  placeholder?: string
  allowNull?: boolean
}) {
  return (
    <div className='flex items-center gap-2'>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='h-7 w-7 rounded-none'
        onClick={() => onChange(Math.max(0, (value || 0) - 1))}
      >
        <Minus className='h-3 w-3' />
      </Button>
      <div className='relative flex-1'>
        <Input
          type='number'
          placeholder={placeholder}
          value={value == null ? '' : value}
          onChange={e => {
            const val = e.target.value
            onChange(val ? parseInt(val) : (allowNull ? null : undefined))
          }}
          className='rounded-none text-center text-sm'
        />
      </div>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='h-7 w-7 rounded-none'
        onClick={() => onChange((value || 0) + 1)}
      >
        <Plus className='h-3 w-3' />
      </Button>
    </div>
  )
}

function UpdateGoalDialog({ goal, onClose }: { goal: GoalWithProgress; onClose: () => void }) {
  const form = useForm({
    defaultValues: {
      value: goal.progress[0]?.value || 0,
    },
  })

  const onSubmit = async (data: { value: number }) => {
    try {
      await updateGoalProgress({
        goalId: goal.id,
        value: data.value,
        date: new Date(),
      })
      onClose()
    } catch (err) {
      console.error('Failed to update goal:', err)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-sm rounded-none border-2 p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-normal tracking-tight'>{goal.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {goal.type === 'COUNTABLE' ? (
                      <NumberInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Enter current value'
                      />
                    ) : (
                      <div className='flex justify-center gap-4'>
                        <Button
                          type='button'
                          variant={field.value === 1 ? 'default' : 'outline'}
                          className='h-8 w-8 rounded-none p-0'
                          onClick={() => field.onChange(1)}
                        >
                          <Check weight='bold' className='h-4 w-4' />
                        </Button>
                        <Button
                          type='button'
                          variant={field.value === 0 ? 'default' : 'outline'}
                          className='h-8 w-8 rounded-none p-0'
                          onClick={() => field.onChange(0)}
                        >
                          <X weight='bold' className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full rounded-none border-foreground text-xs' variant='outline'>
              update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function CreateGoalDialog() {
  const form = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      name: '',
      type: 'COUNTABLE',
      category: 'OTHER',
      frequency: 'DAILY',
      cycleLength: null,
      cycleUnit: undefined,
      startDate: new Date().toISOString().split('T')[0],
      targetValue: null,
      endDate: undefined,
    },
  })

  const onSubmit = async (data: CreateGoalFormData) => {
    try {
      await createGoal({
        name: data.name,
        type: data.type,
        category: data.category,
        frequency: data.frequency,
        cycleLength: data.frequency === 'CUSTOM' && data.cycleLength ? data.cycleLength : undefined,
        cycleUnit: data.frequency === 'CUSTOM' ? data.cycleUnit : undefined,
        startDate: new Date(data.startDate),
        targetValue: data.targetValue,
        isReverse: data.isReverse,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      })
      form.reset()
    } catch (err) {
      console.error('Failed to create goal:', err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size='sm'
          variant='outline'
          className='h-7 rounded-none border-foreground px-3 text-xs'
        >
          <Plus className='mr-1 h-3 w-3' />
          add
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-sm rounded-none border-2 p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-normal tracking-tight'>new goal</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>Name</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      placeholder='Enter goal name'
                      autoComplete='off'
                      {...field}
                      className='rounded-none text-sm'
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    e.g. &ldquo;Go outside for 30 min&rdquo; or &ldquo;Read 12 books&rdquo;
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='rounded-none text-sm'>
                          <SelectValue placeholder='Select goal type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='YES_NO'>
                          Yes/No
                          <span className='block text-xs text-muted-foreground'>
                            Simple completion
                          </span>
                        </SelectItem>
                        <SelectItem value='COUNTABLE'>
                          Countable
                          <span className='block text-xs text-muted-foreground'>
                            Track with numbers
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='rounded-none text-sm'>
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='HEALTH'>Health</SelectItem>
                        <SelectItem value='FINANCE'>Finance</SelectItem>
                        <SelectItem value='CAREER'>Career</SelectItem>
                        <SelectItem value='EDUCATION'>Education</SelectItem>
                        <SelectItem value='PERSONAL'>Personal</SelectItem>
                        <SelectItem value='SOCIAL'>Social</SelectItem>
                        <SelectItem value='CREATIVE'>Creative</SelectItem>
                        <SelectItem value='OTHER'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='frequency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className='rounded-none text-sm'>
                          <SelectValue placeholder='Select frequency' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ONE_TIME'>
                          One-time
                          <span className='block text-xs text-muted-foreground'>
                            Single achievement
                          </span>
                        </SelectItem>
                        <SelectItem value='DAILY'>
                          Daily
                          <span className='block text-xs text-muted-foreground'>
                            Repeat every day
                          </span>
                        </SelectItem>
                        <SelectItem value='WEEKLY'>Weekly</SelectItem>
                        <SelectItem value='MONTHLY'>Monthly</SelectItem>
                        <SelectItem value='ANNUAL'>Annual</SelectItem>
                        <SelectItem value='CUSTOM'>
                          Custom
                          <span className='block text-xs text-muted-foreground'>
                            Set your own cycle
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.watch('frequency') === 'CUSTOM' && (
              <>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='cycleLength'
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel className='text-xs'>Cycle Length</FormLabel>
                        <FormControl>
                          <NumberInput
                            value={value}
                            onChange={onChange}
                            placeholder='Enter cycle length'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='cycleUnit'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs'>Cycle Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger className='rounded-none text-sm'>
                              <SelectValue placeholder='Select unit' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='days'>Days</SelectItem>
                            <SelectItem value='weeks'>Weeks</SelectItem>
                            <SelectItem value='months'>Months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='startDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type='date'
                          autoComplete='off'
                          {...field}
                          className='rounded-none text-sm'
                        />
                      </FormControl>
                      <FormDescription className='text-xs'>
                        When should the cycles start?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {form.watch('type') === 'COUNTABLE' && (
              <>
                <FormField
                  control={form.control}
                  name='targetValue'
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Target Value</FormLabel>
                      <FormControl>
                        <NumberInput
                          value={value}
                          onChange={onChange}
                          placeholder='Enter target value'
                          allowNull
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='isReverse'
                  render={({ field }) => (
                    <FormItem>
                      <div className='flex items-center gap-2'>
                        <FormControl>
                          <input
                            type='checkbox'
                            checked={field.value}
                            onChange={field.onChange}
                            className='h-4 w-4 rounded-none border-foreground'
                          />
                        </FormControl>
                        <FormLabel className='text-xs'>
                          Reverse goal (lower numbers are better)
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-xs'>End Date (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      autoComplete='off'
                      {...field}
                      className='rounded-none text-sm'
                    />
                  </FormControl>
                  <FormDescription className='text-xs'>
                    Leave empty for ongoing goals/habits
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full rounded-none border-foreground text-xs' variant='outline'>
              create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'HEALTH':
      return 'bg-[#00933C]' // Green (6)
    case 'FINANCE':
      return 'bg-[#FCCC0A]' // Yellow (N)
    case 'CAREER':
      return 'bg-[#EE352E]' // Red (1)
    case 'EDUCATION':
      return 'bg-[#FF6319]' // Orange (B/D)
    case 'PERSONAL':
      return 'bg-[#0039A6]' // Blue (A/C/E)
    case 'SOCIAL':
      return 'bg-[#996633]' // Brown (J/Z)
    case 'CREATIVE':
      return 'bg-[#B933AD]' // Purple (7)
    case 'OTHER':
    default:
      return 'bg-[#808183]' // Gray (S)
  }
}

function ProgressIndicator({ goal }: { goal: GoalWithProgress }) {
  const currentValue = goal.progress[0]?.value || 0

  if (goal.type === 'YES_NO') {
    return (
      <div
        className={'h-2 w-2 rounded-full transition-colors ' +
          (!goal.progress.length
            ? 'bg-muted'
            : goal.progress[0].value > 0
              ? 'bg-success'
              : 'bg-destructive'
          )
        }
      />
    )
  }

  const targetValue = goal.targetValue || 0

  // Calculate progress differently for reverse goals
  const progress = targetValue > 0
    ? goal.isReverse
      ? currentValue > targetValue
        ? Math.max(10 - Math.floor(((currentValue - targetValue) / targetValue) * 10), 0)
        : 10
      : Math.min(Math.floor((currentValue / targetValue) * 10), 10)
    : 0

  // Determine color based on progress and goal type
  const getProgressColor = () => {
    // For reverse goals
    if (goal.isReverse && targetValue) {
      if (currentValue <= targetValue) return 'bg-success'
      const percentOver = (currentValue - targetValue) / targetValue
      if (percentOver <= 0.1) return 'bg-warning'
      return 'bg-destructive'
    }

    // For regular goals
    if (!targetValue) return 'bg-muted-foreground'
    const progressPercent = currentValue / targetValue
    if (progressPercent >= 1) return 'bg-success'
    if (progressPercent >= 0.8) return 'bg-warning'
    return 'bg-destructive'
  }

  return (
    <div className='flex gap-1'>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={'h-2 w-2 rounded-full transition-colors ' +
            (i < progress
              ? getProgressColor()
              : 'bg-muted'
            )
          }
        />
      ))}
    </div>
  )
}

function DeleteConfirmDialog({ goal, onClose }: { goal: GoalWithProgress; onClose: () => void }) {
  const handleDelete = async () => {
    try {
      await deleteGoal({ id: goal.id })
      onClose()
    } catch (err) {
      console.error('Failed to delete goal:', err)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-sm rounded-none border-2 p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-normal tracking-tight'>delete goal</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 pt-4'>
          <p className='text-sm'>Are you sure you want to delete &ldquo;{goal.name}&rdquo;?</p>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              className='rounded-none border-foreground px-3 text-xs'
              onClick={onClose}
            >
              cancel
            </Button>
            <Button
              type='button'
              variant='outline'
              className='rounded-none border-destructive text-destructive px-3 text-xs hover:bg-destructive hover:text-destructive-foreground'
              onClick={handleDelete}
            >
              delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getCycleInfo(goal: GoalWithProgress) {
  if (goal.frequency !== 'CUSTOM' || !goal.cycleLength || !goal.cycleUnit) {
    return null
  }

  const now = new Date()
  const startDate = new Date(goal.startDate)
  const msPerDay = 24 * 60 * 60 * 1000
  let cycleDuration: number

  // Calculate cycle duration in milliseconds
  switch (goal.cycleUnit) {
    case 'days':
      cycleDuration = goal.cycleLength * msPerDay
      break
    case 'weeks':
      cycleDuration = goal.cycleLength * 7 * msPerDay
      break
    case 'months':
      // Approximate months as 30.44 days
      cycleDuration = goal.cycleLength * 30.44 * msPerDay
      break
    default:
      return null
  }

  // Calculate current cycle number and next cycle date
  const timeSinceStart = now.getTime() - startDate.getTime()
  const currentCycle = Math.floor(timeSinceStart / cycleDuration) + 1
  let nextCycleDate: Date

  // Calculate next cycle date more accurately based on unit
  switch (goal.cycleUnit) {
    case 'days':
      nextCycleDate = addDays(startDate, currentCycle * goal.cycleLength)
      break
    case 'weeks':
      nextCycleDate = addWeeks(startDate, currentCycle * goal.cycleLength)
      break
    case 'months':
      nextCycleDate = addMonths(startDate, currentCycle * goal.cycleLength)
      break
    default:
      nextCycleDate = new Date(startDate.getTime() + currentCycle * cycleDuration)
  }

  return {
    currentCycle,
    nextCycleDate,
    cycleText: `Every ${goal.cycleLength} ${goal.cycleUnit}`
  }
}

const CATEGORIES = [
  'HEALTH',
  'FINANCE',
  'CAREER',
  'EDUCATION',
  'PERSONAL',
  'SOCIAL',
  'CREATIVE',
  'OTHER',
] as const

type FilterState = {
  categories: Set<string>
  type: 'ALL' | 'YES_NO' | 'COUNTABLE'
  status: 'ALL' | 'NEEDS_UPDATE' | 'COMPLETE' | 'INCOMPLETE'
  frequency: 'ALL' | 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL' | 'CUSTOM'
}

function Filters({ filters, onChange }: {
  filters: FilterState
  onChange: (update: Partial<FilterState>) => void
}) {
  return (
    <div className='flex flex-col gap-8'>
      {/* Categories */}
      <div className='grid grid-cols-4 sm:flex sm:flex-wrap gap-x-8 gap-y-4 sm:gap-4'>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => {
              const next = new Set(filters.categories)
              if (next.has(category)) {
                next.delete(category)
              } else {
                next.add(category)
              }
              onChange({ categories: next })
            }}
            className='group flex flex-col items-center gap-1.5'
          >
            <div
              className={`h-3 w-3 rounded-full transition-transform ${getCategoryColor(category)} ${filters.categories.has(category) ? 'scale-125' : 'opacity-50 hover:opacity-75'
                }`}
            />
            <span className={`text-xs transition-colors ${filters.categories.has(category) ? 'text-foreground' : 'text-muted-foreground'
              }`}>
              {category.toLowerCase()}
            </span>
          </button>
        ))}
        {filters.categories.size > 0 && (
          <button
            onClick={() => {
              onChange({ categories: new Set() })
            }}
            className='group flex flex-col items-center gap-1.5'
          >
            <div className='flex h-3 w-3 items-center justify-center'>
              <X weight='bold' className='h-3 w-3 text-muted-foreground transition-colors group-hover:text-foreground' />
            </div>
            <span className='text-xs text-muted-foreground'>clear</span>
          </button>
        )}
      </div>
    </div>
  )
}

function needsAttention(goal: GoalWithProgress): boolean {
  const now = new Date()
  const lastUpdate = goal.progress[0]?.date ? new Date(goal.progress[0].date) : null
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // For daily goals, check if updated today
  if (goal.frequency === 'DAILY') {
    return lastUpdate === null || lastUpdate < startOfToday
  }

  // For weekly goals, check if it's been updated this week and if it's Thursday or later
  if (goal.frequency === 'WEEKLY') {
    const dayOfWeek = now.getDay() // 0 = Sunday, 6 = Saturday
    const isLateInWeek = dayOfWeek >= 4 // Thursday or later
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfToday.getDate() - dayOfWeek)
    return isLateInWeek && (!lastUpdate || lastUpdate < startOfWeek)
  }

  // For monthly goals, check if it's been updated this month and if it's the 25th or later
  if (goal.frequency === 'MONTHLY') {
    const dayOfMonth = now.getDate()
    const isLateInMonth = dayOfMonth >= 25
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return isLateInMonth && (!lastUpdate || lastUpdate < startOfMonth)
  }

  // For annual goals with a target value (like reading 12 books)
  if (goal.frequency === 'ANNUAL' && goal.type === 'COUNTABLE' && goal.targetValue) {
    const startDate = new Date(goal.startDate)

    // Calculate the end of the annual period (1 year from start)
    const endDate = new Date(startDate)
    endDate.setFullYear(endDate.getFullYear() + 1)

    // If the goal has already ended, don't show it
    if (now > endDate) return false

    // Calculate progress expected at this point
    const totalDuration = endDate.getTime() - startDate.getTime()
    const elapsedDuration = now.getTime() - startDate.getTime()
    const progressPercent = elapsedDuration / totalDuration

    // Calculate expected progress at this point
    const expectedProgress = Math.floor(progressPercent * goal.targetValue)
    const currentProgress = goal.progress[0]?.value || 0

    // Show in Today's Focus if behind expected progress
    return currentProgress < expectedProgress
  }

  // For custom frequency goals
  if (goal.frequency === 'CUSTOM' && goal.cycleLength && goal.cycleUnit) {
    const cycleInfo = getCycleInfo(goal)
    if (!cycleInfo) return false

    const nextCycleDate = cycleInfo.nextCycleDate
    const currentCycleStart = new Date(nextCycleDate)

    // Calculate cycle start based on unit
    switch (goal.cycleUnit) {
      case 'days':
        currentCycleStart.setDate(currentCycleStart.getDate() - goal.cycleLength)
        break
      case 'weeks':
        currentCycleStart.setDate(currentCycleStart.getDate() - (goal.cycleLength * 7))
        break
      case 'months':
        currentCycleStart.setMonth(currentCycleStart.getMonth() - goal.cycleLength)
        break
    }

    // Calculate how far we are through the cycle
    const cycleDuration = nextCycleDate.getTime() - currentCycleStart.getTime()
    const timeElapsed = now.getTime() - currentCycleStart.getTime()
    const percentComplete = timeElapsed / cycleDuration

    // Show in focus for the last 25% of the cycle
    const REMINDER_THRESHOLD = 0.75 // 75% through the cycle
    if (percentComplete >= REMINDER_THRESHOLD) {
      // Check if we've updated during this cycle
      return !lastUpdate || lastUpdate < currentCycleStart
    }
  }

  return false
}

export function DashboardPage() {
  const { data: goals = [], isLoading } = useQuery(getGoals)
  const [selectedGoal, setSelectedGoal] = useState<GoalWithProgress | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<GoalWithProgress | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    categories: new Set(),
    type: 'ALL',
    status: 'ALL',
    frequency: 'ALL'
  })

  const goalsNeedingAttention = goals.filter(needsAttention)
  const filteredGoals = goals.filter(goal => {
    // Category filter
    if (filters.categories.size > 0 && !filters.categories.has(goal.category)) {
      return false
    }

    // Type filter
    if (filters.type !== 'ALL' && goal.type !== filters.type) {
      return false
    }

    // Status filter
    if (filters.status !== 'ALL') {
      const hasProgress = goal.progress.length > 0
      const latestProgress = hasProgress ? goal.progress[0].value : 0
      const isComplete = goal.type === 'YES_NO'
        ? latestProgress > 0
        : goal.targetValue != null && latestProgress >= goal.targetValue

      if (filters.status === 'NEEDS_UPDATE' && hasProgress) return false
      if (filters.status === 'COMPLETE' && !isComplete) return false
      if (filters.status === 'INCOMPLETE' && isComplete) return false
    }

    // Frequency filter
    if (filters.frequency !== 'ALL' && goal.frequency !== filters.frequency) {
      return false
    }

    return true
  })

  if (isLoading) return null

  return (
    <div className='mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8'>
      <div className='space-y-8'>
        {/* Header */}
        <header className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-6xl font-medium tracking-tight'>goals</h1>
            <CreateGoalDialog />
          </div>

          {/* Today's Focus Section */}
          {goalsNeedingAttention.length > 0 && (
            <div className='rounded-lg border border-primary/20 bg-primary/5 p-4'>
              <div className='mb-3 flex items-center gap-2 text-primary'>
                <div className='h-2 w-2 rounded-full bg-primary' />
                <h2 className='text-sm font-medium'>today&apos;s focus</h2>
                <span className='text-xs text-primary/80'>
                  {goalsNeedingAttention.length} goal{goalsNeedingAttention.length === 1 ? '' : 's'} to check in on
                </span>
              </div>
              <div className='space-y-2'>
                {goalsNeedingAttention.map(goal => (
                  <div
                    key={goal.id}
                    className='flex items-center justify-between gap-4'
                  >
                    <div className='flex items-center gap-3'>
                      <div className={`h-2 w-2 rounded-full ${getCategoryColor(goal.category)}`} />
                      <span>{goal.name}</span>
                      {goal.type === 'COUNTABLE' && goal.targetValue && (
                        <span className='text-sm text-muted-foreground'>
                          {goal.progress[0]?.value || 0} / {goal.targetValue}
                        </span>
                      )}
                    </div>
                    <Button
                      size='sm'
                      variant='outline'
                      className='h-7 rounded-none border-primary px-3 text-xs hover:bg-primary hover:text-primary-foreground'
                      onClick={() => setSelectedGoal(goal)}
                    >
                      check in
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='h-px w-full bg-border' />
          <Filters
            filters={filters}
            onChange={update => setFilters(prev => ({ ...prev, ...update }))}
          />
        </header>

        {/* Goals List */}
        <motion.div
          className='flex flex-col gap-8'
          variants={staggerContainer}
          initial='hidden'
          animate='show'
          exit='exit'
        >
          {/* Group goals by category */}
          {CATEGORIES.map(category => {
            const categoryGoals = filteredGoals.filter(g => g.category === category)
            if (categoryGoals.length === 0) return null

            return (
              <div key={category} className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <div className={`h-4 w-4 rounded ${getCategoryColor(category)}`} />
                  <h2 className='text-2xl font-medium'>{category.toLowerCase()}</h2>
                </div>
                <div className='space-y-2'>
                  {categoryGoals.map(goal => (
                    <motion.div
                      key={goal.id}
                      variants={fadeIn}
                      className='group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-border/40'
                    >
                      <div className='flex-1 space-y-2 sm:space-y-1'>
                        <div className='flex items-center justify-between'>
                          <span className='text-lg lowercase'>{goal.name}</span>
                          <div className='flex items-center gap-1 sm:hidden'>
                            <Button
                              size='sm'
                              variant='outline'
                              className='h-7 rounded-none border-foreground px-3 text-xs'
                              onClick={() => setSelectedGoal(goal)}
                            >
                              update
                            </Button>
                            <Button
                              size='sm'
                              variant='outline'
                              className='h-7 rounded-none border-destructive px-3 text-xs'
                              onClick={() => setGoalToDelete(goal)}
                            >
                              <Trash className='h-3 w-3' />
                            </Button>
                          </div>
                        </div>
                        {goal.type === 'COUNTABLE' && goal.targetValue && (
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-muted-foreground'>
                              {goal.progress[0]?.value || 0} / {goal.targetValue}
                            </span>
                            <ProgressIndicator goal={goal} />
                          </div>
                        )}
                        {goal.type === 'YES_NO' && (
                          <div className='flex items-center gap-2'>
                            <ProgressIndicator goal={goal} />
                          </div>
                        )}
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          {goal.frequency === 'CUSTOM' ? (
                            <>
                              {(() => {
                                const cycleInfo = getCycleInfo(goal)
                                if (!cycleInfo) return null
                                return (
                                  <>
                                    <span>Cycle {cycleInfo.currentCycle}</span>
                                    <span>•</span>
                                    <span>Next: {formatDistanceToNow(cycleInfo.nextCycleDate, { addSuffix: true })}</span>
                                  </>
                                )
                              })()}
                            </>
                          ) : (
                            <>
                              <span>{goal.frequency.toLowerCase().replace('_', ' ')}</span>
                              <span>•</span>
                              <span>
                                {(() => {
                                  const now = new Date()
                                  let nextReset: Date

                                  switch (goal.frequency) {
                                    case 'DAILY':
                                      nextReset = new Date(now)
                                      nextReset.setDate(nextReset.getDate() + 1)
                                      nextReset.setHours(0, 0, 0, 0)
                                      break
                                    case 'WEEKLY':
                                      nextReset = new Date(now)
                                      // Get to next Sunday
                                      nextReset.setDate(nextReset.getDate() + (7 - nextReset.getDay()))
                                      nextReset.setHours(0, 0, 0, 0)
                                      break
                                    case 'MONTHLY':
                                      nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
                                      break
                                    case 'ANNUAL':
                                      const startDate = new Date(goal.startDate)
                                      nextReset = new Date(startDate)
                                      // Set to this year's anniversary
                                      nextReset.setFullYear(now.getFullYear())
                                      // If we're past this year's anniversary, set to next year
                                      if (now > nextReset) {
                                        nextReset.setFullYear(now.getFullYear() + 1)
                                      }
                                      break
                                    default:
                                      return null
                                  }
                                  return `Resets ${formatDistanceToNow(nextReset, { addSuffix: true })}`
                                })()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {/* Desktop actions */}
                      <div className='hidden sm:flex items-center justify-end gap-6'>
                        <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-7 rounded-none border-foreground px-3 text-xs'
                            onClick={() => setSelectedGoal(goal)}
                          >
                            update
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-7 rounded-none border-destructive text-destructive px-3 text-xs hover:bg-destructive hover:text-destructive-foreground'
                            onClick={() => setGoalToDelete(goal)}
                          >
                            <Trash className='h-3 w-3' />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {selectedGoal && (
        <UpdateGoalDialog
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
        />
      )}

      {goalToDelete && (
        <DeleteConfirmDialog
          goal={goalToDelete}
          onClose={() => setGoalToDelete(null)}
        />
      )}
    </div>
  )
} 
