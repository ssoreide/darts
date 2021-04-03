import React, { ReactElement, FC, useState } from "react";
import Header from './Header';
import { Container, Toolbar } from '@material-ui/core';
import { APP_TITLE, POLLING_INTERVAL_IN_MS } from "utils/constants";
import Main from "./Main";
import { AddThrow, GameData, PlayerStat } from "../../../../server/src/interfaces";
import { loadLatestGameId, loadGameFromId, createGame, insertThrow } from "api";
import { useEffect } from "react";
import { Multiplier } from "models/interfaces";
import { cloneDeep } from "lodash";

type GameDataWithId = GameData & { gameId: string};
export type DoSetGame = (val: GameDataWithId) => void;

interface LayoutProps {

}

type NullableGame = GameData | null;

const Layout: FC<LayoutProps> = (): ReactElement => {
  const [game, setGame] = useState({} as NullableGame);
  const [gameId, setGameId] = useState('');
  const [pollId, setPollId] = useState(null as NodeJS.Timeout | null);

  const loadGame = async () => {
    doSetGameId(await loadLatestGameId());
  };

  const doCreateGame = async (players: string[]) => {
    const newGameId = await createGame(players);
    doSetGameId(newGameId);
  }

  const doSetGame: DoSetGame = (val: GameDataWithId) => {
    setGame(val);
    doSetGameId(val.gameId);
  }

  const doSetGameId = (id: string) => {
    setGameId(id);
    if (id.length > 0) {
      startPollingGame(id);
    } else {
      stopPollingGame();
    }
  }

  const startPollingGame = (id: string) => {
    stopPollingGame();
    if (id.length === 0) return;
    let retry = 0;
    setPollId(setInterval(async () => {
      try {
        setGame(await loadGameFromId(id));
        retry = 0;
      } catch (err) {
        retry++;
        console.error(err);
        if (retry >= 5) {
          stopPollingGame();
        }
      }
    }, POLLING_INTERVAL_IN_MS))
  }

  const stopPollingGame = () => {
    if (pollId !== null) {
      clearInterval(pollId);
      setPollId(null);
    }
  }

  useEffect(() => {
    async function fetchLatestGame() {
      setGame(await loadGameFromId(gameId));
    }
    if (gameId) {
      fetchLatestGame();
    }
  }, [gameId]);
  
  const sendScore = async (field: number, multiplier?: Multiplier) => {

    const playerThrow: AddThrow = {
      gameid: gameId,
      field,
      multiplier: multiplier ?? '1',
    }
    optimisticallyInsertThrow(playerThrow);
    await insertThrow(playerThrow);
  }
  
  /**
   * TODO - server / client side logic should be rather similar. Should probably factor out.
   */
  const optimisticallyInsertThrow = (playerThrow: AddThrow) => {
    if (!game || !game.playerstat.some(p => p.status === 'playing')) return;
    const copy = cloneDeep(game);
    const playerIndex = copy.playerstat.findIndex(p => p.player === copy.currentPlayer);
    if (playerIndex >= 0) {
      const player = copy.playerstat[playerIndex];
      player.lastThrows.push({
        field: playerThrow.field,
        multiplier: parseInt(playerThrow.multiplier),
        timestamp: ''
      });
      const score = playerThrow.field * parseInt(playerThrow.multiplier);
      const newScore = player.score - score;
      let goToNext = false;
      if (newScore < 0) {
        player.status = 'bust';
        goToNext = true;
      } else if (newScore === 0) {
        player.status = 'wonjustnow';
        goToNext = true;
      } else {
        player.status = 'playing';
        goToNext = player.lastThrows.length === 3;
      }
      player.score = Math.max(newScore, 0);
      if (goToNext && copy.playerstat.some(p => p.status === 'playing')) {
        let nextPlayer: undefined | PlayerStat = undefined;
        let indexPointer = playerIndex;
        while (nextPlayer === undefined) {
          const nextPlayerIndex = (indexPointer === copy.playerstat.length - 1) ? 0 : indexPointer + 1;
          const nextPotentialPlayer = copy.playerstat[nextPlayerIndex];
          if (nextPotentialPlayer.status === 'playing') {
            nextPlayer = nextPotentialPlayer;
          } else {
            indexPointer = nextPlayerIndex;
          }
        }
        copy.currentPlayer = nextPlayer.player;
        nextPlayer.lastThrows = [];
      }
      setGame(copy);
    }
  }

  return (
    <Container maxWidth="xl">
      <Header title={APP_TITLE} loadGame={loadGame} currentGameId={gameId} doCreateGame={doCreateGame} doSetGame={doSetGame}/>
      <Toolbar />
      <Main currentGame={game} gameId={gameId} sendScore={sendScore} />
    </Container>
  );
};
export default Layout;
