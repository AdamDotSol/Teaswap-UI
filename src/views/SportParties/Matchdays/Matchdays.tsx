import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Image, Heading, RowType, Toggle, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { orderBy } from 'lodash'
import useRefresh from 'hooks/useRefresh'
import useI18n from 'hooks/useI18n'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'
import { QuoteToken } from 'config/constants/types'
import { useMatchdays } from 'state/hooks'

import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import CardValue from 'views/Home/components/CardValue'
import { Matchday } from 'state/types'
import { RowProps } from './components/MatchdayTable/Row'
import Table from './components/MatchdayTable/MatchdayTable'
import FarmTabButtons from './components/MatchdayTabButtons'
import { DesktopColumnSchema, ViewMode } from './components/types'

export interface MatchdaysProps {
  tokenMode?: boolean
  type?: string
}

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const TextWrapper = styled.div`
  text-align: center;
  margin-bottom: 25px;
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const NUMBER_OF_FARMS_VISIBLE = 12

const Matchdays: React.FC<MatchdaysProps> = (matchdaysProps) => {
  const TranslateString = useI18n()

  const matchdaysFromState = useMatchdays()

  const { tokenMode, type } = matchdaysProps

  const [query, setQuery] = useState('')
  const [sortOption, setSortOption] = useState('label')
  const [platformOption, setPlatformOption] = useState('all')

  const userDataReady = true

  const [activeOnly, setActiveOnly] = useState(true)

  const activeMatchdays = matchdaysFromState.filter((matchday) => matchday.isActive)
  const inactiveMatchdays = matchdaysFromState.filter((matchday) => !matchday.isActive)

  const matchdaysList = useCallback(
    (matchdaysToDisplay: Matchday[]): Matchday[] => {
      if (query) {
        return matchdaysToDisplay.filter((matchday: Matchday) => {
          return matchday.label.toLowerCase().includes(query.toLowerCase())
        })
      }

      return matchdaysToDisplay
    },
    [query],
  )

  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [observerIsSet, setObserverIsSet] = useState(false)

  const matchdaysMemoized = useMemo(() => {
    const sortMatchdays = (matchdays: Matchday[]): Matchday[] => {
      switch (sortOption) {
        case 'label':
          return orderBy(matchdays, (matchday: Matchday) => matchday.label, 'asc')
        case 'theDate':
          return orderBy(matchdays, (matchday: Matchday) => matchday.id, 'asc')
        default:
          return matchdays
      }
    }

    if (activeOnly) return sortMatchdays(matchdaysList(activeMatchdays))

    return sortMatchdays(matchdaysList(inactiveMatchdays))
  }, [activeMatchdays, activeOnly, inactiveMatchdays, matchdaysList, sortOption])

  const rowData = matchdaysMemoized.map((matchday) => {
    const row: RowProps = {
      theDate: {
        theDate: matchday.theDate.toUpperCase(),
      },
      matchday: {
        label: matchday.label,
        id: matchday.id,
        winnerToken: matchday.winnerToken,
      },
      details: matchday,
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    const columnSchema = DesktopColumnSchema

    const columns = columnSchema.map((column) => ({
      id: column.id,
      name: column.name,
      label: column.label,
      sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
        switch (column.name) {
          case 'matchday':
            return b.id - a.id
          default:
            return 1
        }
      },
      sortable: column.sortable,
    }))

    return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xl" color="secondary" mb="24px">
          Sport Parties
        </Heading>
        <Heading scale="lg" color="text">
          Championsleague
        </Heading>
      </PageHeader>
      <Page>
        <ControlContainer>
          <FilterContainer>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text textTransform="uppercase">Show inactive</Text>
              <Toggle checked={activeOnly} onChange={() => setActiveOnly(!activeOnly)} scale="md" />
            </LabelWrapper>
          </FilterContainer>

          <FilterContainer>
            <LabelWrapper>
              <Text textTransform="uppercase">Sort by</Text>
              <Select
                options={[
                  {
                    label: 'Label',
                    value: 'label',
                  },
                  {
                    label: 'Day',
                    value: 'theDate',
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text textTransform="uppercase">Search</Text>
              <SearchInput onChange={handleChangeQuery} placeholder="Search days" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {renderContent()}
        <div ref={loadMoreRef} />
      </Page>
    </>
  )
}

export default Matchdays