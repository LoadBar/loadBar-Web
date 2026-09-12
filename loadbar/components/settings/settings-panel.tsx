'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CopyUrl } from '@/components/copy-url'
import { placeholderUser, portfolioPath } from '@/lib/placeholder-data'

export function SettingsPanel() {
  const router = useRouter()
  const [username, setUsername] = useState(placeholderUser.username)
  const publicPath = portfolioPath(username || placeholderUser.username)
  const [publicUrl, setPublicUrl] = useState(publicPath)

  useEffect(() => {
    setPublicUrl(`${window.location.origin}${publicPath}`)
  }, [publicPath])

  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h2 className='text-2xl font-semibold tracking-tight'>Settings</h2>
        <p className='text-muted-foreground'>Account, GitHub connection, and portfolio URL.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
          <CardDescription>Details from your connected GitHub account.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-2'>
            <Label htmlFor='account-name'>Name</Label>
            <Input id='account-name' defaultValue={placeholderUser.name} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='account-email'>Email</Label>
            <Input id='account-email' type='email' defaultValue={placeholderUser.email} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GitHub connection</CardTitle>
          <CardDescription>LoadBar uses this connection to fetch and analyse repositories.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-wrap items-center gap-3'>
          <Badge>Connected</Badge>
          <p className='text-sm'>
            @{placeholderUser.githubHandle}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio username and URL</CardTitle>
          <CardDescription>This username is used in your public portfolio URL.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='portfolio-username'>Username</Label>
            <Input
              id='portfolio-username'
              value={username}
              onChange={event => setUsername(event.target.value.replaceAll(' ', '').toLowerCase())}
            />
          </div>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <code className='bg-muted flex-1 rounded-lg px-3 py-2 text-sm break-all'>{publicUrl}</code>
            <CopyUrl value={publicUrl} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sign out</CardTitle>
          <CardDescription>Return to the LoadBar landing page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant='outline' onClick={() => router.push('/')}>
            Sign out
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription>Remove this LoadBar account and its placeholder profile data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger render={<Button variant='destructive' />}>Delete account</DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Delete account</DialogTitle>
                <DialogDescription>
                  This will remove your LoadBar account and take you back to the landing page.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant='destructive' onClick={() => router.push('/')}>
                  Delete account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
