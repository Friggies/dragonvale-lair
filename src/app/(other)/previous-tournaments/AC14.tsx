'use client'

import Image from 'next/image'
import { useState } from 'react'
import contestants from '@/data/previous-tournaments/13-anniversary/contestants.js'
import hardestEggs from '@/data/previous-tournaments/13-anniversary/hardest-eggs.js'
import mostGames from '@/data/previous-tournaments/13-anniversary/mostGames.js'
import Details from '@/components/Details/Details'
import List from '@/components/List/List'

export function AC14() {
    const [numberOfEggsToShow, setNumberOfEggsToShow] = useState(5)
    const [numberOfContestantsToShow, setNumberOfContestantsToShow] =
        useState(5)

    const [numberOfMostGamesToShow, setNumberOfMostGamesToShow] = useState(5)

    return (
        <>
            <Details title="14 Anniversary Contest">
                {true ? (
                    <>
                        <p>Currently planning event...</p>
                        <br />
                    </>
                ) : (
                    <>
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
                                                    <span>
                                                        {contestant.score}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{`${
                                                        index + 1
                                                    }.`}</span>
                                                    <span className="overflow-scroll">
                                                        {contestant.friendID}
                                                    </span>
                                                    <span>
                                                        {contestant.score}
                                                    </span>
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
                        <h3>Trickiest Eggs</h3>
                        <p>The number of incorrect guesses for each egg.</p>
                        <ol className="list">
                            {hardestEggs
                                .slice(0, numberOfEggsToShow)
                                .map((egg) => {
                                    return (
                                        <li key={egg.title}>
                                            <img
                                                width="25"
                                                height="30"
                                                src={`/eggs/${egg.title
                                                    .toLowerCase()
                                                    .replaceAll(' ', '-')}.png`}
                                            />
                                            {`${egg.title}: ${egg.count}`}
                                        </li>
                                    )
                                })}
                        </ol>
                        <button
                            className="link"
                            onClick={() => {
                                setNumberOfEggsToShow(numberOfEggsToShow + 5)
                            }}
                        >
                            Show more...
                        </button>
                        <h3>Statistics</h3>
                        <div>
                            <p>Players: 198</p>
                            <p>Total games played: 6 346</p>
                            <p>Games with 0 pts.: 2 181</p>
                            <p>
                                Avg. pts. per game (including 0-pt. games): 19
                            </p>
                            <p>
                                Avg. pts. per game (excluding 0-pt. games): 28
                            </p>
                            <p>Total eggs guessed correctly: 118 479</p>
                            <p>Total time spent for all games: 82h 34m 41s</p>
                        </div>
                        <h3>Information</h3>
                        <div>
                            <p>Tournament type: Streak Showdown</p>
                            <p>Hard mode percentage: 50%</p>
                            <p>Start: 2024-09-13, 14:00 UTC</p>
                            <p>Finish: 2024-09-19, 14:00 UTC</p>
                            <p>Timespan: 6 days</p>
                        </div>
                        <h3>Rewards</h3>
                        <ol className="list">
                            <li>1st place = 150 gems</li>
                            <li>2nd place = 125 gems</li>
                            <li>3rd place = 100 gems</li>
                            <li>4th place = 75 gems</li>
                            <li>5th place = 50 gems</li>
                        </ol>
                        <h3>Most games played</h3>
                        <ol className="list list--contestants">
                            {mostGames
                                .slice(0, numberOfMostGamesToShow)
                                .map((game, index) => {
                                    return (
                                        <li key={game.friendID}>
                                            <span>{index + 1}.</span>
                                            <span className="overflow-scroll">
                                                {game.friendID}
                                            </span>
                                            <span>{`${game.games_played} (+${game.games_with_zero_points})`}</span>
                                        </li>
                                    )
                                })}
                        </ol>
                        <button
                            className="link"
                            onClick={() => {
                                setNumberOfMostGamesToShow(
                                    numberOfMostGamesToShow + 5
                                )
                            }}
                        >
                            Show more...
                        </button>
                        <h3>Thank you so much!</h3>
                    </>
                )}
            </Details>
        </>
    )
}
