import { css } from "@emotion/react";
import { Movie, MovieId, MovieRevenue } from "../types/movie";
import { NextPage, GetStaticProps, InferGetStaticPropsType } from "next"

import MovieCard from '../components/movie-ranking/movie'

const moviesRevenueMap: ReadonlyMap<MovieId, MovieRevenue> = new Map([
  [900667, 197],
  [810693, 137.5],
  [916224, 137.4],
  [361743, 135.7],
  [783675, 107.7],
  [903939, 97.8],
  [507086, 63.2],
  [961420, 51.6],
  [338953, 46.0],
  [634429, 44.4],
  [634649, 44.4],
])

export const getStaticProps: GetStaticProps<{ movies: Movie[] }> = async () =>  {
  const movieIdList: MovieId[] = Array.from(moviesRevenueMap.keys())
  const promiseList = movieIdList.map((id) => {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=ja`)
  })
  const responseList = await Promise.all(promiseList)
  const movies: Movie[] = await Promise.all(responseList.map(async (res): Promise<Movie> => res.json()))

  return {
    props: { movies }
  }
}

const rankingJapanBoxoffice2022: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ movies }) => {

  return (
    <div 
      css={css`
        padding: 32px;
      `}
    >
      <h2
        css={css`
          text-align: center;
        `}
      >
        2022年映画興行収入ランキング日本おすすめ（上半期/下半期/洋画/邦画/アニメ）
      </h2>

      <div
        css={css`
          padding: 24px 0;
        `}
      >

      </div>
      <ol
        css={css`
          counter-reset: item;
          list-style-type: none;
        `}
      >
        {
          movies.map((movie, i) => 
            <li 
              key={i}
              css={css`
                li:before {
                counter-increment: item;
                content: counter(item)'.';
              `}
            >
              <MovieCard 
                movie={movie}
                revenue={moviesRevenueMap.get(movie.id)!}
              />
            </li>
          )
        }
      </ol>
    </div>
  )
}

export default rankingJapanBoxoffice2022