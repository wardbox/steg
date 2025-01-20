import { motion } from 'motion/react'
import { fadeIn } from '../motion/transitionPresets'

export default function Privacy() {
  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={fadeIn}
      className='mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8'
    >
      <div className='space-y-8'>
        <h1 className='text-4xl font-light tracking-tight'>privacy policy</h1>

        <div className='space-y-4 text-sm text-muted-foreground'>
          <p>
            This privacy policy describes how steg (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your information.
          </p>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>information we collect</h2>
            <p>
              We collect information you provide directly to us when you:
            </p>
            <ul className='list-inside list-disc space-y-1 pl-4'>
              <li>Create an account</li>
              <li>Create or modify goals</li>
              <li>Update goal progress</li>
              <li>Contact us for support</li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>how we use your information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className='list-inside list-disc space-y-1 pl-4'>
              <li>Provide and improve our services</li>
              <li>Send you updates and notifications</li>
              <li>Respond to your requests and questions</li>
              <li>Analyze usage patterns to improve the user experience</li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>data storage</h2>
            <p>
              Your data is stored securely and we take reasonable measures to protect it from unauthorized access, disclosure, or destruction.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>your rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className='list-inside list-disc space-y-1 pl-4'>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{' '}
              <a
                href='mailto:support@steg.app'
                className='text-foreground underline'
              >
                support@steg.app
              </a>
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>updates</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
            <p>
              Last updated: 2025.19.01
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  )
} 
