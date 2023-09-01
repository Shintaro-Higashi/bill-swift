'use client'

import { ErrorComponent, ThemedLayoutV2 } from '@refinedev/mui'
import { useEffect } from 'react'

/**
 * フロント側のグローバルエラーページです。
 */

// export default function Error() {
//   return (
//     <ThemedLayoutV2>
//       <ErrorComponent />
//     </ThemedLayoutV2>
//   )
// }

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
