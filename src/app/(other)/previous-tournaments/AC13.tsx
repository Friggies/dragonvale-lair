'use client'

import Image from '@/components/Image/Image'
import { useState } from 'react'
import contestants from '@/data/previous-tournaments/13-anniversary/contestants.js'
import hardestEggs from '@/data/previous-tournaments/13-anniversary/hardest-eggs.js'
import longesGames from '@/data/previous-tournaments/13-anniversary/longestGames.js'
import mostGames from '@/data/previous-tournaments/13-anniversary/mostGames.js'
import Details from '@/components/Details/Details'
import List from '@/components/List/List'

export function AC13() {
    const [numberOfEggsToShow, setNumberOfEggsToShow] = useState(5)
    const [numberOfContestantsToShow, setNumberOfContestantsToShow] =
        useState(5)
    const [numberOfLongestGamesToShow, setNumberOfLongestGamesToShow] =
        useState(5)

    const [numberOfMostGamesToShow, setNumberOfMostGamesToShow] = useState(5)

    return (
        <>
            <Details title="13 Anniversary Contest">
                <h3>Contestants</h3>
                <List>
                    {contestants
                        .slice(0, numberOfContestantsToShow)
                        .map((contestant, index) => {
                            return (
                                <>
                                    {index >= 0 && index <= 4 ? (
                                        <>
                                            <Image
                                                width="11"
                                                height="18"
                                                src="/eggyHatchy/gem.png"
                                                alt={`${contestant.friendID}'s gem`}
                                            />
                                            <span className="overflow-scroll">
                                                {contestant.friendID}
                                            </span>
                                            <span>{contestant.score}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{`${index + 1}.`}</span>
                                            <span className="overflow-scroll">
                                                {contestant.friendID}
                                            </span>
                                            <span>{contestant.score}</span>
                                        </>
                                    )}
                                </>
                            )
                        })}
                </List>
                <button
                    className="link"
                    onClick={() => {
                        setNumberOfContestantsToShow(
                            numberOfContestantsToShow + 5
                        )
                    }}
                >
                    Show more...
                </button>
                <br />
                <br />
                <h3>Trickiest Eggs</h3>
                <p>The number of incorrect guesses for each egg.</p>
                <List>
                    {hardestEggs.slice(0, numberOfEggsToShow).map((egg) => {
                        return (
                            <>
                                <img
                                    width="25"
                                    height="30"
                                    src={`/eggs/${egg.title
                                        .toLowerCase()
                                        .replaceAll(' ', '-')}.png`}
                                />
                                <p>{`${egg.title}: ${egg.count}`}</p>
                            </>
                        )
                    })}
                </List>
                <button
                    className="link"
                    onClick={() => {
                        setNumberOfEggsToShow(numberOfEggsToShow + 5)
                    }}
                >
                    Show more...
                </button>
                <br />
                <br />
                <h3>Statistics</h3>
                <List>
                    <>
                        <span>Players:</span>
                        <span>198</span>
                    </>
                    <>
                        <span>Total games played:</span>
                        <span>6 346</span>
                    </>
                    <>
                        <span>Games with 0 pts.:</span>
                        <span>2 181</span>
                    </>
                    <>
                        <span>Avg. pts. per game (including 0-pt. games):</span>
                        <span>19</span>
                    </>
                    <>
                        <span>Avg. pts. per game (excluding 0-pt. games):</span>
                        <span>28</span>
                    </>
                    <>
                        <span>Total eggs guessed correctly:</span>
                        <span>118 479</span>
                    </>
                    <>
                        <span>Total time spent for all games:</span>
                        <span>82h 34m 41s</span>
                    </>
                </List>
                <br />
                <br />
                <h3>Information</h3>
                <List>
                    <>
                        <span>Tournament type:</span>
                        <span>Streak Showdown</span>
                    </>
                    <>
                        <span>Hard mode percentage:</span>
                        <span>50%</span>
                    </>
                    <>
                        <span>Start:</span>
                        <span>2024-09-13, 14:00 UTC</span>
                    </>
                    <>
                        <span>Finish:</span>
                        <span>2024-09-19, 14:00 UTC</span>
                    </>
                    <>
                        <span>Timespan:</span>
                        <span>6 days</span>
                    </>
                </List>
                <br />
                <br />
                <h3>Rewards</h3>
                <List>
                    <>
                        <span>1st place:</span>
                        <span>150 gems</span>
                    </>
                    <>
                        <span>2nd place:</span>
                        <span>125 gems</span>
                    </>
                    <>
                        <span>3rd place:</span>
                        <span>100 gems</span>
                    </>
                    <>
                        <span>4th place:</span>
                        <span>75 gems</span>
                    </>
                    <>
                        <span>5th place:</span>
                        <span>50 gems</span>
                    </>
                </List>
                <br />
                <br />
                <h3>Most games played</h3>
                <List>
                    {mostGames
                        .slice(0, numberOfMostGamesToShow)
                        .map((game, index) => {
                            return (
                                <>
                                    <span>{index + 1}.</span>
                                    <span className="overflow-scroll">
                                        {game.friendID}
                                    </span>
                                    <span>{`${game.games_played} (+${game.games_with_zero_points})`}</span>
                                </>
                            )
                        })}
                </List>
                <button
                    className="link"
                    onClick={() => {
                        setNumberOfMostGamesToShow(numberOfMostGamesToShow + 5)
                    }}
                >
                    Show more...
                </button>
                <br />
                <br />
                <h3>Longest games played</h3>
                <List>
                    {longesGames
                        .slice(0, numberOfLongestGamesToShow)
                        .map((game, index) => {
                            return (
                                <>
                                    <span>{index + 1}.</span>
                                    <span className="overflow-scroll">
                                        {game.friendID}
                                    </span>
                                    <span>{`${game.longest_running_game_minutes}m ${game.longest_running_game_seconds}s`}</span>
                                </>
                            )
                        })}
                </List>
                <button
                    className="link"
                    onClick={() => {
                        setNumberOfLongestGamesToShow(
                            numberOfLongestGamesToShow + 5
                        )
                    }}
                >
                    Show more...
                </button>
                <br />
                <br />
                <h3>Thank you so much!</h3>
                <Image
                    variant="large"
                    src="/fanart/stalker111121-fanart-low.png"
                    height="500"
                    width="500"
                    alt="Fanart of the Fire Dragon celebrating the 13th anniversary"
                />
                <p>
                    Illustration by <em>Stalker111121</em>
                </p>
            </Details>
        </>
    )
}
