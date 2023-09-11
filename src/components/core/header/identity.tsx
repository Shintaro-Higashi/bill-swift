'use client'

import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useGetIdentity } from '@refinedev/core'
import React from 'react'

interface IUser {
  name: string
  avatar: string
}

const Identity: React.FC = () => {
  const { data: user } = useGetIdentity<IUser>()

  return (
    <>
      {(user?.avatar || user?.name) && (
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
          <Avatar src={user?.avatar} alt={user?.name} />
        </Stack>
      )}
    </>
  )
}
export default Identity
