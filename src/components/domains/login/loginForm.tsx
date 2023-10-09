'use client'

import { LoginPageProps, useActiveAuthProvider, RegisterFormTypes } from '@refinedev/core'
import { useForm, UseFormProps } from '@refinedev/react-hook-form'
import { FormProvider } from 'react-hook-form'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import MuiLink from '@mui/material/Link'
import Stack from '@mui/material/Stack'

import type { BoxProps } from '@mui/material/Box'
import type { CardContentProps } from '@mui/material/CardContent'

import {
  BaseRecord,
  HttpError,
  useLogin,
  useTranslate,
  useRouterContext,
  useRouterType,
  useLink,
} from '@refinedev/core'
import { ThemedTitleV2 } from '@refinedev/mui'
import React, { CSSProperties } from 'react'

interface FormPropsType extends UseFormProps {
  onSubmit?: (values: RegisterFormTypes) => void
}

interface LoginFormTypes {
  userId?: string
  password?: string
  remember?: boolean
  providerName?: string
  redirectPath?: string
}

type LoginProps = LoginPageProps<BoxProps, CardContentProps, FormPropsType>

const layoutStyles: CSSProperties = {}
const titleStyles: CSSProperties = {
  textAlign: 'center',
  fontSize: '24px',
  marginBottom: '24px',
  overflowWrap: 'break-word',
  hyphens: 'manual',
  textOverflow: 'unset',
  whiteSpace: 'pre-wrap',
}

/**
 * <AuthPage>から呼び出されるrefineライブラリ内のclosed Component <LoginPage>の複製拡張コンポーネントです。
 * <pre>
 *  既存のコンポーネントでは入力ログイン情報がメールアドレス固定のため、userIdベースに修正をしています。
 * </pre>
 */
export const LoginForm: React.FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
}) => {
  const { onSubmit, ...useFormProps } = formProps || {}
  const methods = useForm<BaseRecord, HttpError, LoginFormTypes>({
    ...useFormProps,
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  const authProvider = useActiveAuthProvider()
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  })
  const translate = useTranslate()
  const routerType = useRouterType()
  const Link = useLink()
  const { Link: LegacyLink } = useRouterContext()

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '32px',
          fontSize: '20px',
        }}
      >
        {title ?? (
          <ThemedTitleV2
            collapsed={false}
            wrapperStyles={{
              gap: '8px',
            }}
          />
        )}
      </div>
    )

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          <Stack spacing={1}>
            {providers.map((provider: any) => {
              return (
                <Button
                  key={provider.name}
                  variant='outlined'
                  fullWidth
                  sx={{
                    color: 'primary.light',
                    borderColor: 'primary.light',
                    textTransform: 'none',
                  }}
                  onClick={() => login({ providerName: provider.name })}
                  startIcon={provider.icon}
                >
                  {provider.label}
                </Button>
              )
            })}
          </Stack>
          <Divider
            sx={{
              fontSize: '12px',
              marginY: '16px',
            }}
          >
            {translate('pages.login.divider', 'or')}
          </Divider>
        </>
      )
    }
    return null
  }

  const Content = (
    <Card {...(contentProps ?? {})}>
      <CardContent sx={{ p: '32px', '&:last-child': { pb: '32px' } }}>
        <Typography component='h1' variant='h5' align='center' style={titleStyles} color='primary' fontWeight={700}>
          {translate('pages.login.title', 'Sign in to your account')}
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit((data) => {
            if (onSubmit) {
              return onSubmit(data)
            }

            return login(data)
          })}
        >
          {renderProviders()}
          <TextField
            {...register('userId', {
              required: true,
            })}
            id='userId'
            margin='normal'
            fullWidth
            label='ユーザID'
            error={!!errors.userId}
            name='userId'
            type='text'
            placeholder='ログイン用ユーザIDを入力'
            autoComplete='username'
            sx={{
              mt: 0,
            }}
          />
          <TextField
            {...register('password', {
              required: true,
            })}
            id='password'
            margin='normal'
            fullWidth
            name='password'
            label='パスワード'
            helperText={errors?.password?.message}
            error={!!errors.password}
            type='password'
            placeholder='ログイン用パスワードを入力'
            autoComplete='current-password'
            sx={{
              mb: 0,
            }}
          />

          <Box
            component='div'
            sx={{
              mt: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {rememberMe ?? (
              <FormControlLabel
                sx={{
                  span: {
                    fontSize: '14px',
                    color: 'text.secondary',
                  },
                }}
                color='secondary'
                control={<Checkbox size='small' id='remember' {...register('remember')} />}
                label={translate('pages.login.buttons.rememberMe', 'Remember me')}
              />
            )}
            {forgotPasswordLink ?? (
              <MuiLink
                variant='body2'
                color='primary'
                fontSize='12px'
                component={ActiveLink}
                underline='none'
                to='/forgot-password'
              >
                {translate('pages.login.buttons.forgotPassword', 'Forgot password?')}
              </MuiLink>
            )}
          </Box>
          <Button type='submit' fullWidth variant='contained' disabled={isLoading} sx={{ mt: '24px' }}>
            {translate('pages.login.signin', 'Sign in')}
          </Button>
          {registerLink ?? (
            <Box
              sx={{
                mt: '24px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography textAlign='center' variant='body2' component='span' fontSize='12px'>
                {translate('pages.login.buttons.noAccount', 'Don’t have an account?')}
              </Typography>
              <MuiLink
                ml='4px'
                fontSize='12px'
                variant='body2'
                color='primary'
                component={ActiveLink}
                underline='none'
                to='/register'
                fontWeight='bold'
              >
                {translate('pages.login.signup', 'Sign up')}
              </MuiLink>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <FormProvider {...methods}>
      <Box component='div' style={layoutStyles} {...(wrapperProps ?? {})}>
        <Container
          component='main'
          maxWidth='xs'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {renderContent ? (
              renderContent(Content, PageTitle)
            ) : (
              <>
                {PageTitle}
                {Content}
              </>
            )}
          </Box>
        </Container>
      </Box>
    </FormProvider>
  )
}
