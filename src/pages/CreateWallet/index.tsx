import React, { useContext, useEffect, useState } from 'react'
import { ContentContainer, PageContainer } from '../../components/PageComponents'
import { walletGenerate, Wallet } from 'alf-client'
import { useHistory, useParams } from 'react-router'
import CreateAccount from './CreateAccount'
import WalletWords from './WalletWords'
import { GlobalContext } from '../../App'
import CheckWordsIntro from './CheckWordsIntro'
import CheckWords from './CheckWords'

interface RouteParams {
  step: string | undefined
}

interface Context {
  plainWallet?: Wallet
  mnemonic: string
  username: string
  password: string
  setContext: React.Dispatch<React.SetStateAction<Context>>
  onButtonNext: () => void
  onButtonBack: () => void
}

const initialContext: Context = {
  mnemonic: '',
  username: '',
  password: '',
  setContext: () => null,
  onButtonNext: () => null,
  onButtonBack: () => null
}

export const CreateWalletContext = React.createContext<Context>(initialContext)

// ============== //
/* MAIN COMPONENT */
// ============== //

const CreateWallet = () => {
  const { networkType } = useContext(GlobalContext)
  const history = useHistory()
  const { step } = useParams<RouteParams>()

  const onButtonNext = () => {
    history.push(`/create/${stepNumber + 1}`)
  }
  const onButtonBack = () => {
    if (stepNumber === 0) {
      history.push('/')
    } else {
      history.push(`/create/${stepNumber - 1}`)
    }
  }

  const [context, setContext] = useState<Context>(initialContext)

  // Init wallet
  useEffect(() => {
    const result = walletGenerate(networkType)
    setContext((prevContext) => ({
      ...prevContext,
      plainWallet: result.wallet,
      mnemonic: result.mnemonic
    }))
  }, [networkType])

  // Steps management
  const stepNumber = step ? parseInt(step) : 0

  const createWalletSteps: JSX.Element[] = [
    <CreateAccount key="create-account" />,
    <WalletWords key="wallet-words" />,
    <CheckWordsIntro key="check-words-intro" />,
    <CheckWords key="check-words" />
  ]

  // Redirect if step not set properly
  if (stepNumber > createWalletSteps.length) {
    history.replace(`/create/${createWalletSteps.length - 1}`)
  }

  const isStepNumberCorrect = () => {
    return stepNumber >= 0 && stepNumber < createWalletSteps.length
  }

  return (
    <CreateWalletContext.Provider value={{ ...context, setContext, onButtonNext, onButtonBack }}>
      <PageContainer>
        <ContentContainer>{isStepNumberCorrect() && createWalletSteps[stepNumber]}</ContentContainer>
      </PageContainer>
    </CreateWalletContext.Provider>
  )
}

export default CreateWallet
