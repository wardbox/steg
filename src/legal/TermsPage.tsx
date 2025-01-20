import { motion } from 'motion/react'
import { fadeIn } from '../motion/transitionPresets'

export default function Terms() {
  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={fadeIn}
      className='mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8'
    >
      <div className='space-y-8'>
        <h1 className='text-4xl font-light tracking-tight'>terms of service</h1>

        <div className='space-y-4 text-sm text-muted-foreground'>
          <p>
            By using steg, you agree to these terms. Please read them carefully.
          </p>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>
              acceptance of terms
            </h2>
            <p>
              By accessing or using steg, you agree to be bound by these Terms
              of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>
              user accounts
            </h2>
            <ul className='list-inside list-disc space-y-1 pl-4'>
              <li>
                You must provide accurate and complete information when creating
                an account
              </li>
              <li>
                You are responsible for maintaining the security of your account
              </li>
              <li>You must not share your account credentials with others</li>
              <li>
                You must notify us immediately of any unauthorized use of your
                account
              </li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>
              acceptable use
            </h2>
            <p>You agree not to:</p>
            <ul className='list-inside list-disc space-y-1 pl-4'>
              <li>Use the service for any illegal purpose</li>
              <li>
                Attempt to gain unauthorized access to any part of the service
              </li>
              <li>Interfere with or disrupt the service</li>
              <li>Create multiple accounts for abusive purposes</li>
            </ul>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>
              intellectual property
            </h2>
            <p>
              The service and its original content, features, and functionality
              are owned by steg and are protected by international copyright,
              trademark, and other intellectual property laws.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>
              termination
            </h2>
            <p>
              We may terminate or suspend your account and access to the service
              immediately, without prior notice or liability, for any reason,
              including without limitation if you breach the Terms of Service.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>
              changes to terms
            </h2>
            <p>
              We reserve the right to modify or replace these terms at any time.
              We will provide notice of any changes by posting the new Terms of
              Service on this page.
            </p>
          </section>

          <section className='space-y-2'>
            <h2 className='text-base font-medium text-foreground'>contact</h2>
            <p>
              If you have questions about these terms, please contact us at{' '}
              <a
                href='mailto:support@steg.app'
                className='text-foreground underline'
              >
                support@steg.app
              </a>
            </p>
          </section>

          <section className='space-y-2'>
            <p>Last updated: 2025.19.01</p>
          </section>
        </div>
      </div>
    </motion.div>
  )
}
