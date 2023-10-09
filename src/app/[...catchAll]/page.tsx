import { authProvider } from '@/core/providers/authProvider'
import { notFound, redirect } from 'next/navigation'

type Props = {
  params: {
    catchAll: string[]
  }
}

export default async function CatchAll(props: Props) {
  const { authenticated, redirectTo } = await authProvider.check()
  if (authenticated) {
    return notFound()
  } else {
    const pathname = props.params.catchAll.join('/')

    let to = ''
    // ignore only `/` routes
    if (pathname !== '/') {
      to = `?to=${pathname}`
    }
    return redirect(`${redirectTo}${to}`)
  }
}
