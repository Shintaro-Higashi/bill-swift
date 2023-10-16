'use client'

import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useGetIdentity } from '@refinedev/core'
import React from 'react'

interface IUser {
  name: string
}

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  const names = name.split(' ')
  const first = names[0][0]
  const last = names.length > 1 ? names[1][0] : ''
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${first}${last}`,
  }
}

const Identity: React.FC = () => {
  const { data: user } = useGetIdentity<IUser>()

  return (
    <>
      {user?.name && (
        <Stack direction='row' gap='16px' alignItems='center' justifyContent='center'>
          {user?.name && (
            <Typography
              sx={{
                display: {
                  xs: 'none',
                  sm: 'inline-block',
                },
              }}
              variant='subtitle2'
            >
              {user?.name}
            </Typography>
          )}
          <Avatar {...stringAvatar(user.name)} />
        </Stack>
      )}
    </>
  )
}
export default Identity
