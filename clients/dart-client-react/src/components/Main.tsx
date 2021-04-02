import React, { ReactElement, FC } from "react";
import { Container, Grid } from "@material-ui/core"
import { AddThrow, GameData } from "../../../../server/src/interfaces";
import PlayerTable from './PlayerTable';
import ButtonGrid from './ButtonGrid';
import { insertThrow } from "api";
import { Multiplier } from "models/interfaces";
import styled from "styled-components";

const RootContainer = styled(Container)(prop => `
  padding-top: 20px;
`)

interface MainProps {
  currentGame: GameData | null;
  gameId: string;
}

const Main: FC<MainProps> = ( { currentGame, gameId }): ReactElement => {
  const sendScore = async (field: number, multiplier?: Multiplier) => {
    const playerThrow: AddThrow = {
      gameid: gameId,
      field,
      multiplier: multiplier ?? '1',
    }
    await insertThrow(playerThrow);
  }

  return (
    <RootContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <PlayerTable currentGame={currentGame} />
        </Grid>
        <Grid item xs={12} lg={7}>
          <ButtonGrid gameId={gameId} sendScore={sendScore}/>
        </Grid>
      </Grid>
    </RootContainer>
  );
};
export default Main;