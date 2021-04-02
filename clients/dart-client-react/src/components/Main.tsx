import React, { ReactElement, FC } from "react";
import { Container, Grid } from "@material-ui/core"
import { AddThrow, GameData } from "../../../../server/src/interfaces";
import { makeStyles } from '@material-ui/core/styles';
import PlayerTable from './PlayerTable';
import ButtonGrid from './ButtonGrid';
import { insertThrow } from "api";
import { Multiplier } from "models/interfaces";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: '20px',
  },
  active: {
    color: 'blue'
  },
  busted: {
    color: 'red'
  },
  done: {
    color: 'green'
  },
  currentPlayer: {
    paddingBottom: '10px',
    textAlign: 'center'
  }
}));

interface MainProps {
  currentGame: GameData | null;
  gameId: string;
}

const Main: FC<MainProps> = ( { currentGame, gameId }): ReactElement => {
  const styles = useStyles();

  const sendScore = async (field: number, multiplier?: Multiplier) => {
    const playerThrow: AddThrow = {
      gameid: gameId,
      field,
      multiplier: multiplier ?? '1',
    }
    await insertThrow(playerThrow);
  }

  return (
    <Container className={styles.root}>
      <Grid container spacing={2}>
        <Grid item lg>
          <PlayerTable currentGame={currentGame} />
        </Grid>
        <Grid item lg>
          <ButtonGrid gameId={gameId} sendScore={sendScore}/>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Main;