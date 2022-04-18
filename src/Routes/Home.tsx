import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { motion, AnimatePresence, useViewportScroll } from 'framer-motion';
import { getMovies, IGetMoviesResult } from '../api';
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { useNavigate, useMatch, PathMatch } from 'react-router-dom';


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

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div) <{ bgPhoto: string }>`
  background-color: #fff;
  height: 200px;
  font-size: 66px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  width: 100%;
  position: absolute;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.7);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${props => props.theme.black.lighter};
`;

const BigCover = styled.img`
  width: 100%;
  background-size: cover;
  height: 400px;
  background-position: center center;
`;

const BigTitle = styled.h2`
  color: ${props => props.theme.white.lighter};
  padding: 10px;
  font-size: 40px;
  position: relative;
  top: -60px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${props => props.theme.white.lighter};
  position: relative;
  top: -60px;
`;


// Variants (framer-motion)
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
}

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: .5,
      duration: .3,
      type: "tween"
    }
  },
}

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: .5,
      duration: .3,
      type: "tween"
    }
  },
}





// 전역변수
const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch('/movies/:movieId');
  // console.log(bigMovieMatch)
  const { scrollY } = useViewportScroll();

  const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies)
  // console.log(data, isLoading)

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false)
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true)
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => prev === maxIndex ? 0 : prev + 1)
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`)
  };
  const onOverlayClick = () => navigate('/')
  const clickedMovie = bigMovieMatch?.params.movieId &&
    data?.results.find(movie => (
      movie.id + "" === bigMovieMatch.params.movieId))
  console.log(clickedMovie)


  return (
    <Wrapper>
      {isLoading ? (
        <Loder>로딩중...</Loder>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{
                  type: "tween",
                  duration: 1,
                }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map(movie => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      variants={boxVariants}
                      initial="normal"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BigMovie
                    layoutId={bigMovieMatch.params.movieId}
                    style={{ top: scrollY.get() + 80 }}
                  >
                    {
                      clickedMovie && <>
                        <BigCover style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`
                        }} />
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                      </>
                    }
                  </BigMovie>
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )
      }

    </Wrapper >
  )
}

export default Home