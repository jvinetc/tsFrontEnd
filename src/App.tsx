import AppRouter from './AppRouter'
import GlobalMessage from './components/GlobalMessage'
import GlobalSpinner from './components/GlobalSpinner'
import { LoadingProvider } from './context/LoadingContext'
import { MessageProvider } from './context/MessageContext '
import { SocketProvider } from './context/SocketContext'
import { UserProvider } from './context/UserContext'
import './index.css'

function App() {

  return (
    <SocketProvider>
      <UserProvider>
        <LoadingProvider>
          <MessageProvider>
            <GlobalMessage />
            <GlobalSpinner />
            <AppRouter />
          </MessageProvider>
        </LoadingProvider>
      </UserProvider>
    </SocketProvider>
  )
}

export default App
