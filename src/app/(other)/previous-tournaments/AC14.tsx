'use client'

import Image from '@/components/Image/Image'
import { useState } from 'react'
import contestants from '@/data/previous-tournaments/14-anniversary/highest_score.json'
import completion_rates from '@/data/previous-tournaments/14-anniversary/completion_rate_pct.json'
import top_games from '@/data/previous-tournaments/14-anniversary/top_25_games_by_points_not_scores.json'
import best_game from '@/data/previous-tournaments/14-anniversary/best_game.json'
import Details from '@/components/Details/Details'
import List from '@/components/List/List'
import transformToEggName from '@/utils/transformToEggName'

export function AC14() {
    const [numberOfContestantsToShow, setNumberOfContestantsToShow] =
        useState(5)

    const [
        numberOfMostCompletionRatesToShow,
        setNumberOfMostCompletionRatesToShow,
    ] = useState(5)

    const [
        numberOfBestCompletedGamesToShow,
        setNumberOfBestCompletedGamesToShow,
    ] = useState(5)

    return (
        <Details title="14 Anniversary Contest">
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
                                            alt={`${contestant.friend_id}'s gem`}
                                        />
                                        <span className="overflow-scroll">
                                            {contestant.friend_id}
                                        </span>
                                        <span>
                                            {contestant.max_total_points}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span>{`${index + 1}. `}</span>
                                        <span className="overflow-scroll">
                                            {contestant.friend_id}
                                        </span>
                                        <span>
                                            {contestant.max_total_points}
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
                    setNumberOfContestantsToShow(numberOfContestantsToShow + 5)
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
                    <span>151</span>
                </>
                <>
                    <span>Total games played:</span>
                    <span>26 932</span>
                </>
                <>
                    <span>Anonymous games:</span>
                    <span>223</span>
                </>
                <>
                    <span>Total eggs banked:</span>
                    <span>93409</span>
                </>
            </List>
            <br />
            <br />
            <h3>Information</h3>
            <List>
                <>
                    <span>Tournament type:</span>
                    <span>Eggy Hatchy</span>
                </>
                <>
                    <span>Start:</span>
                    <span>2025-09-12, 12:00 UTC</span>
                </>
                <>
                    <span>Finish:</span>
                    <span>2025-09-18, 14:00 UTC</span>
                </>
                <>
                    <span>Timespan:</span>
                    <span>6 days and 2 hours</span>
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
            <p>
                The gem rewards will be distributed on{' '}
                <time dateTime="2025-09-23">September 23, 2025</time>.
            </p>
            <br />
            <br />
            <h3>Most games played (and completion rates)</h3>
            <List>
                {completion_rates
                    .slice(0, numberOfMostCompletionRatesToShow)
                    .map((game, index) => {
                        return (
                            <>
                                <span>{index + 1}.&nbsp;</span>
                                <span className="overflow-scroll">
                                    {game.player}
                                </span>
                                <span>{`${game.total_games} (${game.completion_rate_pct}%)`}</span>
                            </>
                        )
                    })}
            </List>
            <button
                className="link"
                onClick={() => {
                    setNumberOfMostCompletionRatesToShow(
                        numberOfMostCompletionRatesToShow + 5
                    )
                }}
            >
                Show more...
            </button>
            <br />
            <br />
            <h3>Best 25 completed games (without bonus boost multiplier)</h3>
            <List>
                {top_games
                    .slice(0, numberOfBestCompletedGamesToShow)
                    .map((game, index) => {
                        return (
                            <>
                                <span>{index + 1}.&nbsp;</span>
                                <span className="overflow-scroll">
                                    {game.player}
                                </span>
                                <span>{`${game.base_points}`}</span>
                            </>
                        )
                    })}
            </List>
            <button
                className="link"
                onClick={() => {
                    setNumberOfBestCompletedGamesToShow(
                        numberOfBestCompletedGamesToShow + 5
                    )
                }}
            >
                Show more...
            </button>
            <br />
            <br />
            <h3>{`Winning game by ${best_game[0].friend_id}`}</h3>
            <List>
                {best_game[0].bank.eggs.map((egg) => (
                    <>
                        <span>
                            {`Level ${egg.level} ${egg.name} with ${
                                egg.points
                            } points (${egg.twin ? 'twin' : 'not twin'})`}
                        </span>
                        <img
                            width="25"
                            height="30"
                            src={transformToEggName(egg.name)}
                        />
                    </>
                ))}
            </List>
            <List>
                <>
                    <span>Total points</span>
                    <span>504328</span>
                </>
                <>
                    <span>BONUS</span>
                    <span>1220%</span>
                </>
                <>
                    <span>Final score</span>
                    <span>{best_game[0].score}</span>
                </>
            </List>
            <br />
            <br />
            <h3>Thank you so much!</h3>
            <Image
                variant="large"
                src="/fanart/wiplian-fanart-low.webp"
                height="500"
                width="500"
                alt="Fanart of a Weaver Dragon who wove a Woven Dragon by Wiplian"
            />
            <p>
                Illustration by <em>Wiplian</em>
            </p>
        </Details>
    )
}
