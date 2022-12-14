import { useCallback } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake, sousStakeBnb } from 'utils/callHelpers'
import { useMasterchef, useMastermint, useMasterteasport, useSousChef } from './useContract'

const useStake = (pid: number, type: string) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  
  const masterChefContract = useMasterchef()
  const masterMintContract = useMastermint()
  const masterTeaSportContract = useMasterteasport()

  let contract = null
  if (type === 'Sugar')
    contract = masterChefContract
  else if (type === 'Mint')
    contract = masterMintContract
  else
    contract = masterTeaSportContract

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(contract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, contract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWallet()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
