import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies } from '../api';
import NowPlaying from '../components/NowPlaying';
import Popular from '../components/Popular';
import Upcoming from '../components/Upcoming';
import { makeImagePath } from '../utils';


// styled-components
const Wrapper = styled.div`
  background: black;
`;

const Loder = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),
  url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;


// interface
interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  },
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}


interface IPopularMovie {
  poster_path: string;
  overview: string;
  release_date: string;
  // genre_ids: number;
  id: number;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
}

export interface IGetPopularMovies {
  page: number;
  results: IPopularMovie[];
}

interface IUpcomingMovie {
  poster_path: string;
  overview: string;
  release_date: string;
  // genre_ids: number;
  id: number;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
}

export interface IGetUpcomingMovies {
  page: number;
  results: IUpcomingMovie[];
}


function Home() {

  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)

  return (
    <Wrapper>
      {isLoading ? (
        <Loder>로딩중...</Loder>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <NowPlaying />
          <Popular />
          <Upcoming />
        </>
      )
      }

    </Wrapper >
  )
}

export default Home