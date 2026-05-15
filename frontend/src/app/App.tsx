import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { AppRouter } from './router'
import { Provider } from './provider'
import { SmoothScroll, IntroLoader } from '@shared/lib/animation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <SmoothScroll>
          <BrowserRouter>
            <IntroLoader />
            <AppRouter />
          </BrowserRouter>
        </SmoothScroll>
      </Provider>
    </QueryClientProvider>
  )
}
