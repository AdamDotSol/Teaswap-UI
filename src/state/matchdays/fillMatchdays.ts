import { Matchday, Match } from 'state/types'
import { ChampionsLeagueToken } from 'config/constants/types'
 


const findWinnerMatchdayToken = (matchday: Matchday ): ChampionsLeagueToken => {
  return matchday.id % 2 === 0 ? ChampionsLeagueToken.SUGAR: ChampionsLeagueToken.TEASPORT

}

const findWinnerMatchToken = (match: Match ): ChampionsLeagueToken => {
  return match.id % 3 === 0 ? ChampionsLeagueToken.TEASPORT: ChampionsLeagueToken.SUGAR

}

const findMatchdayDate = (matchday: Matchday ): string => {
  return matchday.matches[0].matchDate

}
 
 
const fillMatchdays = (matchdays: Matchday[] ): Matchday[] => {

  const calculatedMatchdays = matchdays.map((matchday) => {

 
    const winnerMatchdayToken = findWinnerMatchdayToken(matchday)

    const isActive = matchday.id % 2 === 0

    const theDate = findMatchdayDate(matchday)

    const filledInMAtchday = matchday.matches.map ( match => {


      const winnerMatchToken = findWinnerMatchToken(match)

      return {...filledInMAtchday, winnerMatchToken}
    })




    return { ...matchday, winnerMatchdayToken, isActive, theDate }

  })

  return calculatedMatchdays

} 

  
export default fillMatchdays
