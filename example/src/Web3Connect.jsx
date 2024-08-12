// import { useAccount } from 'wagmi'
import { useAccount, createStorage, useDisconnect } from 'wagmi'

const Web3ConnectButton = (props) => {
  const { address, setAddress, setOpen } = props

  const { isConnecting, isDisconnected, isReconnecting } = useAccount()
  const { connectors, disconnect } = useDisconnect()

  console.log('address................. 1', address)
  console.log('isDisconnected................. 1', isDisconnected)
  const handleClick = () => {
    if (address) {
      localStorage.removeItem('@w3m-storage/SOCIAL_USERNAME')
      localStorage.removeItem('@w3m/connected_social')
      localStorage.removeItem('@w3m-storage/EMAIL')
      localStorage.removeItem('@w3m-storage/EMAIL_LOGIN_USED_KEY')
      localStorage.removeItem('@w3m-storage/LAST_USED_CHAIN_KEY')
      localStorage.removeItem('@w3m-storage/SMART_ACCOUNT_ENABLED_NETWORKS')
      localStorage.removeItem('wagmi.recentConnectorId')
      localStorage.removeItem('@w3m/connected_connector')
      localStorage.removeItem('wagmi.store')

      disconnect()
      setAddress(undefined)
    } else if (isDisconnected) {
      setOpen(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting || isReconnecting ? true : undefined}
    >
      {address
        ? `Disconnect 0x...${address.substring(address.length - 5)}`
        : isConnecting || isReconnecting
        ? 'Try reconnecting...'
        : 'Connect Web3 Wallet'}
    </button>
  )
}

export default Web3ConnectButton
