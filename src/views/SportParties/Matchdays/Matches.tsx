import React from 'react'
import { RowType } from '@pancakeswap-libs/uikit'

import { Match } from 'state/types'
import { RowProps } from './components/MatchTable/Row'
import Table from './components/MatchTable/MatchTable'
import { DesktopColumnSchema } from './components/MatchTable/types'

export interface MatchesProps {
  filledMatches?: Match[]
}

const Matches: React.FC<MatchesProps> = ({ filledMatches }) => {
  const userDataReady = true

  const rowData = filledMatches.map((match) => {
    const row: RowProps = {
      match: {
        id: match.id,
        winnerToken: match.winnerToken,
      },
      theDate: {
        theDate: new Date(match.beginTime).toLocaleDateString(),
      },
      details: match,
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
          case 'match':
            return b.id - a.id
          default:
            return 1
        }
      },
      sortable: column.sortable,
    }))

    return <Table data={rowData} columns={columns} userDataReady={userDataReady} />
  }

  return <>{renderContent()}</>
}

export default Matches
